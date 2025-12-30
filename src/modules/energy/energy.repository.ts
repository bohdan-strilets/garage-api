import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import type { FilterQuery, Model, UpdateQuery } from 'mongoose';

import {
  PaginatedResult,
  paginateFind,
  PaginationOptions,
  sanitizeSort,
} from '@app/common/pagination';
import { objectIdToString } from '@app/common/utils';

import { EnergyKind } from './enums';
import { EnergySession } from './schemas';
import { EnergySessionInput } from './types';

@Injectable()
export class EnergyRepository {
  constructor(
    @InjectModel(EnergySession.name)
    private readonly model: Model<EnergySession>,
  ) {}

  async create(input: EnergySessionInput): Promise<EnergySession> {
    return await this.model.create(input);
  }

  async updateForOwner(
    ownerId: string,
    energySessionId: string,
    input: EnergySessionInput,
  ): Promise<EnergySession | null> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedEnergySessionId = objectIdToString(energySessionId);

    const filter: FilterQuery<EnergySession> = {
      _id: formattedEnergySessionId,
      ownerId: formattedOwnerId,
    };

    const update: UpdateQuery<EnergySession> = {
      $set: {
        kind: input.kind,
        date: input.date,
        odometerKm: input.odometerKm,
        totalCostPln: input.totalCostPln,
        currency: input.currency,
        stationName: input.stationName,
        notes: input.notes,
        fuel: input.fuel ?? null,
        charge: input.charge ?? null,
      },
    };

    const options = { new: true };

    return await this.model.findOneAndUpdate(filter, update, options).lean().exec();
  }

  async findByIdForOwner(ownerId: string, energySessionId: string): Promise<EnergySession | null> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedEnergySessionId = objectIdToString(energySessionId);

    const filter: FilterQuery<EnergySession> = {
      _id: formattedEnergySessionId,
      ownerId: formattedOwnerId,
    };

    return await this.model.findOne(filter).lean().exec();
  }

  async findLastForVehicle(vehicleId: string): Promise<EnergySession | null> {
    const formattedVehicleId = objectIdToString(vehicleId);

    const filter: FilterQuery<EnergySession> = {
      vehicleId: formattedVehicleId,
    };

    return await this.model.findOne(filter).sort({ odometerKm: -1, date: -1 }).lean().exec();
  }

  async paginateForVehicle(
    ownerId: string,
    vehicleId: string,
    kind: EnergyKind | undefined,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<EnergySession>> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedVehicleId = objectIdToString(vehicleId);

    const filter: FilterQuery<EnergySession> = {
      ownerId: formattedOwnerId,
      vehicleId: formattedVehicleId,
    };

    if (kind) {
      filter.kind = kind;
    }

    const options: PaginationOptions = {
      ...pagination,
      sort: sanitizeSort(pagination.sort ?? { date: -1, _id: -1 }),
      lean: true,
    };

    const result = await paginateFind<EnergySession>(this.model, filter, options);

    return {
      items: result.items,
      meta: result.meta,
    };
  }

  async deleteForOwner(ownerId: string, energySessionId: string): Promise<boolean> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedEnergySessionId = objectIdToString(energySessionId);

    const filter: FilterQuery<EnergySession> = {
      _id: formattedEnergySessionId,
      ownerId: formattedOwnerId,
    };

    const result = await this.model.deleteOne(filter).exec();
    return result.deletedCount === 1;
  }
}
