import { Injectable, Logger } from '@nestjs/common';

import {
  odometerValueTooLow,
  vehicleNotFound,
  vehiclePlateAlreadyExists,
} from '@app/common/errors';
import { PaginatedResult, PaginationOptions } from '@app/common/pagination';
import { objectIdToString } from '@app/common/utils';

import { CreateVehicleDto, UpdateVehicleDto } from './dto';
import { vehicleSelfProjection } from './projections';
import { CreateVehicleInput, VehicleListItem, VehicleSelf } from './types';
import { VehiclesRepository } from './vehicles.repository';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(private readonly vehiclesRepository: VehiclesRepository) {}

  async createForOwner(ownerId: string, dto: CreateVehicleDto): Promise<VehicleSelf> {
    const formattedOwnerId = objectIdToString(ownerId);

    const plateNumber = dto.identifiers.plateNumber;
    const plateExists = await this.vehiclesRepository.existsActiveByPlateNumber(
      formattedOwnerId,
      plateNumber,
    );

    if (plateExists) {
      this.logger.debug('Conflict: vehicle plate number already exists');
      vehiclePlateAlreadyExists();
    }

    if (dto.odometer.current < dto.odometer.initial) {
      this.logger.debug('BadRequest: current odometer value is less than initial value');
      odometerValueTooLow();
    }

    const createVehicleInput: CreateVehicleInput = {
      ownerId: formattedOwnerId,
      ...dto,
    };

    const created = await this.vehiclesRepository.create(createVehicleInput);
    const formattedVehicleId = objectIdToString(created._id);

    const vehicleSelf: VehicleSelf = await this.vehiclesRepository.findByIdForOwner(
      formattedVehicleId,
      formattedOwnerId,
      vehicleSelfProjection,
    );

    if (!vehicleSelf) {
      this.logger.debug('NotFound: vehicle not found after creation');
      vehicleNotFound();
    }

    return vehicleSelf;
  }

  async getByIdForOwner(ownerId: string, vehicleId: string): Promise<VehicleSelf> {
    const vehicle: VehicleSelf = await this.vehiclesRepository.findByIdForOwner(
      vehicleId,
      ownerId,
      vehicleSelfProjection,
    );

    if (!vehicle) {
      this.logger.debug('NotFound: vehicle not found');
      vehicleNotFound();
    }

    return vehicle;
  }

  async getListForOwner(
    ownerId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<VehicleListItem>> {
    const result = await this.vehiclesRepository.findManyByOwner(ownerId, pagination);

    return { items: result.items as VehicleListItem[], meta: result.meta };
  }

  async updateForOwner(
    ownerId: string,
    vehicleId: string,
    dto: UpdateVehicleDto,
  ): Promise<VehicleSelf> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedVehicleId = objectIdToString(vehicleId);

    const current = await this.vehiclesRepository.findByIdForOwner(
      formattedVehicleId,
      formattedOwnerId,
      vehicleSelfProjection,
    );

    if (!current) {
      this.logger.debug('NotFound: vehicle not found for update');
      vehicleNotFound();
    }

    if (dto.identifiers?.plateNumber) {
      const newPlate = dto.identifiers.plateNumber.toUpperCase();
      const oldPlate = current.identifiers.plateNumber.toUpperCase();

      if (newPlate !== oldPlate) {
        const plateExists = await this.vehiclesRepository.existsActiveByPlateNumber(
          formattedOwnerId,
          newPlate,
        );

        if (plateExists) {
          this.logger.debug('Conflict: vehicle plate number already exists on update');
          vehiclePlateAlreadyExists();
        }
      }
    }

    if (dto.odometer) {
      const newInitial =
        typeof dto.odometer.initial === 'number' ? dto.odometer.initial : current.odometer.initial;

      const newCurrent =
        typeof dto.odometer.current === 'number' ? dto.odometer.current : current.odometer.current;

      if (newCurrent < newInitial) {
        this.logger.debug('BadRequest: current odometer < initial on update');
        odometerValueTooLow();
      }
    }

    const updated: VehicleSelf = await this.vehiclesRepository.updateByIdForOwner(
      formattedVehicleId,
      formattedOwnerId,
      dto,
      vehicleSelfProjection,
    );

    return updated;
  }

  async deleteForOwner(ownerId: string, vehicleId: string): Promise<boolean> {
    return await this.vehiclesRepository.softDeleteByIdForOwner(vehicleId, ownerId);
  }
}
