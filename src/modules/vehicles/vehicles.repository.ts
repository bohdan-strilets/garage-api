import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, ProjectionType, UpdateQuery } from 'mongoose';

import {
  PaginatedResult,
  paginateFind,
  PaginationOptions,
  sanitizeSort,
} from '@app/common/pagination';
import { getNow, objectIdToString } from '@app/common/utils';

import { Vehicle } from './schemas';
import { CreateVehicleInput } from './types';

@Injectable()
export class VehiclesRepository {
  constructor(@InjectModel(Vehicle.name) private readonly model: Model<Vehicle>) {}

  private activeByIdForOwner = (vehicleId: string, ownerId: string) =>
    ({
      _id: vehicleId,
      ownerId,
      isDeleted: false,
    }) as const;

  private activeByOwner = (ownerId: string) =>
    ({
      ownerId,
      isDeleted: false,
    }) as const;

  async create(input: CreateVehicleInput): Promise<Vehicle> {
    const formattedOwnerId = objectIdToString(input.ownerId);
    return await this.model.create({ ...input, ownerId: formattedOwnerId });
  }

  async findByIdForOwner(
    vehicleId: string,
    ownerId: string,
    projection?: ProjectionType<Vehicle>,
  ): Promise<Vehicle | null> {
    const formattedVehicleId = objectIdToString(vehicleId);
    const formattedOwnerId = objectIdToString(ownerId);

    const filter: FilterQuery<Vehicle> = this.activeByIdForOwner(
      formattedVehicleId,
      formattedOwnerId,
    );

    return await this.model.findOne(filter, projection).lean().exec();
  }

  async findManyByOwner(
    ownerId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Vehicle>> {
    const formattedOwnerId = objectIdToString(ownerId);

    const filter: FilterQuery<Vehicle> = this.activeByOwner(formattedOwnerId);
    const sort = sanitizeSort(pagination.sort, { createdAt: -1 });

    return await paginateFind<Vehicle>(this.model, filter, {
      ...pagination,
      sort,
      lean: true,
    });
  }

  async existsActiveByPlateNumber(ownerId: string, plateNumber: string): Promise<boolean> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedPlateNumber = plateNumber.toUpperCase();

    const filter: FilterQuery<Vehicle> = {
      ownerId: formattedOwnerId,
      'identifiers.plateNumber': formattedPlateNumber,
      isDeleted: false,
    };

    const exists = await this.model.exists(filter);
    return !!exists;
  }

  async updateByIdForOwner(
    vehicleId: string,
    ownerId: string,
    update: UpdateQuery<Vehicle>,
    projection?: ProjectionType<Vehicle>,
  ): Promise<Vehicle | null> {
    const formattedVehicleId = objectIdToString(vehicleId);
    const formattedOwnerId = objectIdToString(ownerId);

    const filter: FilterQuery<Vehicle> = this.activeByIdForOwner(
      formattedVehicleId,
      formattedOwnerId,
    );

    const options = { new: true, projection };

    return await this.model.findOneAndUpdate(filter, update, options).lean().exec();
  }

  async softDeleteByIdForOwner(vehicleId: string, ownerId: string): Promise<boolean> {
    const formattedVehicleId = objectIdToString(vehicleId);
    const formattedOwnerId = objectIdToString(ownerId);

    const filter: FilterQuery<Vehicle> = this.activeByIdForOwner(
      formattedVehicleId,
      formattedOwnerId,
    );

    const now = getNow();

    const update: UpdateQuery<Vehicle> = {
      isDeleted: true,
      deletedAt: now,
    };

    const options = { new: true };

    const result = await this.model.findOneAndUpdate(filter, update, options).lean().exec();

    return !!result;
  }
}
