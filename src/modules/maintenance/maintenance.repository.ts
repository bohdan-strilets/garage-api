import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import {
  PaginatedResult,
  paginateFind,
  PaginationOptions,
  sanitizeSort,
} from '@app/common/pagination';
import { objectIdToString } from '@app/common/utils';

import { Maintenance } from './schemas';
import { MaintenanceInput } from './types';
import { MaintenanceFilters } from './types/maintenance-filters.type';

@Injectable()
export class MaintenanceRepository {
  constructor(
    @InjectModel(Maintenance.name)
    private readonly model: Model<Maintenance>,
  ) {}

  async createForVehicle(input: MaintenanceInput): Promise<Maintenance> {
    const formattedVehicleId = objectIdToString(input.vehicleId);
    const formattedOwnerId = objectIdToString(input.ownerId);

    return await this.model.create({
      ...input,
      vehicleId: formattedVehicleId,
      ownerId: formattedOwnerId,
    });
  }

  async updateForVehicle(
    maintenanceId: string,
    update: MaintenanceInput,
  ): Promise<Maintenance | null> {
    const formattedMaintenanceId = objectIdToString(maintenanceId);
    const formattedVehicleId = objectIdToString(update.vehicleId);
    const formattedOwnerId = objectIdToString(update.ownerId);

    const filter: FilterQuery<Maintenance> = {
      _id: formattedMaintenanceId,
      ownerId: formattedOwnerId,
      vehicleId: formattedVehicleId,
    };

    const updateData: UpdateQuery<Maintenance> = { $set: update };
    const options = { new: true };

    return await this.model.findOneAndUpdate(filter, updateData, options).exec();
  }

  async deleteForVehicle(
    ownerId: string,
    vehicleId: string,
    maintenanceId: string,
  ): Promise<boolean> {
    const formattedMaintenanceId = objectIdToString(maintenanceId);
    const formattedVehicleId = objectIdToString(vehicleId);
    const formattedOwnerId = objectIdToString(ownerId);

    const filter: FilterQuery<Maintenance> = {
      _id: formattedMaintenanceId,
      ownerId: formattedOwnerId,
      vehicleId: formattedVehicleId,
    };

    const result = await this.model.deleteOne(filter).exec();
    return result.deletedCount === 1;
  }

  async findByIdForVehicle(
    ownerId: string,
    vehicleId: string,
    maintenanceId: string,
  ): Promise<Maintenance | null> {
    const formattedMaintenanceId = objectIdToString(maintenanceId);
    const formattedVehicleId = objectIdToString(vehicleId);
    const formattedOwnerId = objectIdToString(ownerId);

    const filter: FilterQuery<Maintenance> = {
      _id: formattedMaintenanceId,
      ownerId: formattedOwnerId,
      vehicleId: formattedVehicleId,
    };

    return await this.model.findOne(filter).exec();
  }

  async paginateForVehicle(
    ownerId: string,
    vehicleId: string,
    filters: MaintenanceFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Maintenance>> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedVehicleId = objectIdToString(vehicleId);

    const filter: FilterQuery<Maintenance> = {
      ownerId: formattedOwnerId,
      vehicleId: formattedVehicleId,
    };

    const { kind, status, dateFrom, dateTo, odometerMin, odometerMax } = filters;

    if (kind) {
      filter.kind = kind;
    }

    if (status) {
      filter.status = status;
    }

    if (dateFrom || dateTo) {
      const dateFilter: Record<string, unknown> = {};

      if (dateFrom instanceof Date && !Number.isNaN(dateFrom.getTime())) {
        dateFilter.$gte = dateFrom;
      }

      if (dateTo instanceof Date && !Number.isNaN(dateTo.getTime())) {
        dateFilter.$lte = dateTo;
      }

      if (Object.keys(dateFilter).length > 0) {
        filter.date = dateFilter as any;
      }
    }

    const hasMin = typeof odometerMin === 'number' && !Number.isNaN(odometerMin);
    const hasMax = typeof odometerMax === 'number' && !Number.isNaN(odometerMax);

    if (hasMin || hasMax) {
      const odometerFilter: Record<string, number> = {};

      if (hasMin) {
        odometerFilter.$gte = odometerMin as number;
      }

      if (hasMax) {
        odometerFilter.$lte = odometerMax as number;
      }

      if (Object.keys(odometerFilter).length > 0) {
        filter.odometer = odometerFilter as any;
      }
    }

    const options: PaginationOptions = {
      ...pagination,
      sort: sanitizeSort(pagination.sort, { date: -1, odometer: -1 }),
    };

    return await paginateFind<Maintenance>(this.model, filter, options);
  }
}
