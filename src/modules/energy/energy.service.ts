import { Injectable, Logger } from '@nestjs/common';

import { Currency } from '@app/common/enums';
import { energySessionNotFound, odometerValueTooLow } from '@app/common/errors';
import { PaginatedResult, PaginationOptions } from '@app/common/pagination';
import { objectIdToString } from '@app/common/utils';

import { VehiclesService } from '../vehicles';

import { CreateEnergySessionDto, UpdateEnergySessionDto } from './dto';
import { EnergyRepository } from './energy.repository';
import { EnergyKind } from './enums';
import { EnergySession } from './schemas';
import { EnergyCharge, EnergyFuel } from './schemas/subdocs';
import { EnergySessionInput, FuelAndCharge } from './types';

@Injectable()
export class EnergyService {
  private readonly logger = new Logger(EnergyService.name);

  constructor(
    private readonly repo: EnergyRepository,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async createForVehicle(
    ownerId: string,
    vehicleId: string,
    dto: CreateEnergySessionDto,
  ): Promise<EnergySession> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const formattedOwnerId = objectIdToString(ownerId);
    const formattedVehicleId = objectIdToString(vehicleId);

    const last = await this.repo.findLastForVehicle(formattedVehicleId);

    if (last && dto.odometerKm < last.odometerKm) {
      this.logger.debug('Creating energy session, but odometer is less than last recorded');

      odometerValueTooLow();
    }

    const currency = dto.currency ?? Currency.PLN;

    const { fuel, charge } = this.mapFuelAndCharge(dto);

    const input: EnergySessionInput = {
      ownerId: formattedOwnerId,
      vehicleId: formattedVehicleId,
      kind: dto.kind,
      date: dto.date,
      odometerKm: dto.odometerKm,
      totalCostPln: dto.totalCostPln,
      currency,
      stationName: dto.stationName,
      notes: dto.notes,
      fuel,
      charge,
    };

    return await this.repo.create(input);
  }

  async updateForOwner(
    ownerId: string,
    vehicleId: string,
    sessionId: string,
    dto: UpdateEnergySessionDto,
  ): Promise<EnergySession> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const formattedOwnerId = objectIdToString(ownerId);
    const formattedVehicleId = objectIdToString(vehicleId);
    const formattedSessionId = objectIdToString(sessionId);

    const existing = await this.repo.findByIdForOwner(formattedOwnerId, formattedSessionId);

    if (!existing) {
      this.logger.debug('Energy session to update not found for owner');
      energySessionNotFound();
    }

    if (objectIdToString(existing.vehicleId) !== formattedVehicleId) {
      this.logger.debug('Energy session does not belong to the specified vehicle');

      energySessionNotFound();
    }

    const last = await this.repo.findLastForVehicle(formattedVehicleId);

    if (last && last._id !== existing._id && dto.odometerKm < last.odometerKm) {
      this.logger.debug('Updating energy session, but odometer is less than last recorded');

      odometerValueTooLow();
    }

    const currency = dto.currency ?? Currency.PLN;
    const { fuel, charge } = this.mapFuelAndCharge(dto);

    const input: EnergySessionInput = {
      ownerId: formattedOwnerId,
      vehicleId: formattedVehicleId,
      kind: dto.kind,
      date: dto.date,
      odometerKm: dto.odometerKm,
      totalCostPln: dto.totalCostPln,
      currency,
      stationName: dto.stationName,
      notes: dto.notes,
      fuel,
      charge,
    };

    const updated = await this.repo.updateForOwner(formattedOwnerId, formattedSessionId, input);

    if (!updated) {
      this.logger.debug('Energy session to update not found after update attempt');
      energySessionNotFound();
    }

    return updated;
  }

  async getForVehicle(
    ownerId: string,
    vehicleId: string,
    pagination: PaginationOptions,
    kind: EnergyKind,
  ): Promise<PaginatedResult<EnergySession>> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const formattedOwnerId = objectIdToString(ownerId);
    const formattedVehicleId = objectIdToString(vehicleId);

    return await this.repo.paginateForVehicle(
      formattedOwnerId,
      formattedVehicleId,
      kind,
      pagination,
    );
  }

  async getByIdForOwner(
    ownerId: string,
    vehicleId: string,
    sessionId: string,
  ): Promise<EnergySession> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const formattedOwnerId = objectIdToString(ownerId);
    const formattedSessionId = objectIdToString(sessionId);

    const session: EnergySession = await this.repo.findByIdForOwner(
      formattedOwnerId,
      formattedSessionId,
    );

    if (!session) {
      this.logger.debug('Energy session not found by id for owner');
      energySessionNotFound();
    }

    if (objectIdToString(session.vehicleId) !== vehicleId) {
      this.logger.debug('Energy session does not belong to the specified vehicle');
      energySessionNotFound();
    }

    return session;
  }

  async deleteForOwner(ownerId: string, vehicleId: string, sessionId: string): Promise<void> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const formattedOwnerId = objectIdToString(ownerId);
    const formattedSessionId = objectIdToString(sessionId);

    const deleted = await this.repo.deleteForOwner(formattedOwnerId, formattedSessionId);

    if (!deleted) {
      this.logger.debug('Energy session to delete not found for owner');
      energySessionNotFound();
    }
  }

  private mapFuelAndCharge(dto: CreateEnergySessionDto | UpdateEnergySessionDto): FuelAndCharge {
    if (dto.kind === EnergyKind.FUEL) {
      const fuel: EnergyFuel = {
        type: dto.fuelType!,
        volumeLiters: dto.fuelVolumeLiters!,
        pricePerLiterPln: dto.fuelPricePerLiterPln!,
        isFull: dto.fuelIsFull ?? false,
      };

      return { fuel, charge: null };
    }

    if (dto.kind === EnergyKind.CHARGE) {
      const charge: EnergyCharge = {
        type: dto.chargerType!,
        energyKwh: dto.energyKwh!,
        pricePerKwhPln: dto.pricePerKwhPln!,
        powerKw: dto.powerKw,
        durationMinutes: dto.durationMinutes,
        isFull: dto.chargeIsFull ?? false,
      };

      return { fuel: null, charge };
    }

    return { fuel: null, charge: null };
  }
}
