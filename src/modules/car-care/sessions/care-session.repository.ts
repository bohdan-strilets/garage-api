import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

import { PaginatedResult, paginateFind, PaginationOptions } from '@app/common/pagination';
import { objectIdToString } from '@app/common/utils';

import { CareSession } from './schemas';
import { CareSessionFilters, CareSessionInput } from './types';

@Injectable()
export class CareSessionRepository {
  constructor(
    @InjectModel(CareSession.name)
    private readonly model: Model<CareSession>,
  ) {}

  async create(input: CareSessionInput): Promise<CareSession> {
    const formattedOwnerId = objectIdToString(input.ownerId);
    const formattedVehicleId = objectIdToString(input.vehicleId);

    return await this.model.create({
      ...input,
      ownerId: formattedOwnerId,
      vehicleId: formattedVehicleId,
    });
  }

  async findByIdForOwner(ownerId: string, sessionId: string): Promise<CareSession | null> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedSessionId = objectIdToString(sessionId);

    const filter: FilterQuery<CareSession> = {
      _id: formattedSessionId,
      ownerId: formattedOwnerId,
    };

    return await this.model.findOne(filter).exec();
  }

  async paginateForVehicle(
    ownerId: string,
    vehicleId: string,
    filters: CareSessionFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<CareSession>> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedVehicleId = objectIdToString(vehicleId);

    const filter: FilterQuery<CareSession> = {
      ownerId: formattedOwnerId,
      vehicleId: formattedVehicleId,
    };

    if (filters.kind) {
      filter.kind = filters.kind;
    }

    if (filters.dateFrom || filters.dateTo) {
      filter.date = {};
      if (filters.dateFrom) {
        filter.date.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        filter.date.$lte = new Date(filters.dateTo);
      }
    }

    if (filters.odometerMin !== undefined || filters.odometerMax !== undefined) {
      filter.odometer = {};
      if (filters.odometerMin !== undefined) {
        filter.odometer.$gte = parseInt(filters.odometerMin, 10);
      }
      if (filters.odometerMax !== undefined) {
        filter.odometer.$lte = parseInt(filters.odometerMax, 10);
      }
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      filter.price = {};
      if (filters.priceMin !== undefined) {
        filter.price.$gte = parseFloat(filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        filter.price.$lte = parseFloat(filters.priceMax);
      }
    }

    return await paginateFind<CareSession>(this.model, filter, pagination);
  }

  async updateByIdForOwner(
    ownerId: string,
    sessionId: string,
    update: UpdateQuery<CareSession>,
  ): Promise<CareSession | null> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedSessionId = objectIdToString(sessionId);

    const filter: FilterQuery<CareSession> = {
      _id: formattedSessionId,
      ownerId: formattedOwnerId,
    };

    const options: QueryOptions<CareSession> = { new: true };

    return await this.model.findOneAndUpdate(filter, update, options).exec();
  }

  async deleteByIdForOwner(ownerId: string, sessionId: string): Promise<void> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedSessionId = objectIdToString(sessionId);

    const filter: FilterQuery<CareSession> = {
      _id: formattedSessionId,
      ownerId: formattedOwnerId,
    };

    await this.model.deleteOne(filter).exec();
  }
}
