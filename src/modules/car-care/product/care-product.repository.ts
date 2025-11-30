import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

import { PaginatedResult, paginateFind, PaginationOptions } from '@app/common/pagination';
import { objectIdToString } from '@app/common/utils';

import { CareProduct } from './schemas';
import { CareProductFilters, CareProductInput } from './types';

@Injectable()
export class CareProductRepository {
  constructor(
    @InjectModel(CareProduct.name)
    private readonly model: Model<CareProduct>,
  ) {}

  async create(input: CareProductInput): Promise<CareProduct> {
    const formattedOwnerId = objectIdToString(input.ownerId);
    const formattedVehicleId = objectIdToString(input.vehicleId);

    return await this.model.create({
      ...input,
      ownerId: formattedOwnerId,
      vehicleId: formattedVehicleId,
    });
  }

  async findByIdForOwner(ownerId: string, productId: string): Promise<CareProduct | null> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedProductId = objectIdToString(productId);

    const filter: FilterQuery<CareProduct> = {
      _id: formattedProductId,
      ownerId: formattedOwnerId,
    };

    return await this.model.findOne(filter).exec();
  }

  async paginateForVehicle(
    ownerId: string,
    vehicleId: string,
    filters: CareProductFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<CareProduct>> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedVehicleId = objectIdToString(vehicleId);

    const filter: FilterQuery<CareProduct> = {
      ownerId: formattedOwnerId,
      vehicleId: formattedVehicleId,
    };

    if (filters.kind) {
      filter.kind = filters.kind;
    }

    if (filters.dateFrom || filters.dateTo) {
      filter.purchaseDate = {};
      if (filters.dateFrom) {
        filter.purchaseDate.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        filter.purchaseDate.$lte = new Date(filters.dateTo);
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

    return await paginateFind<CareProduct>(this.model, filter, pagination);
  }

  async updateByIdForOwner(
    ownerId: string,
    productId: string,
    update: UpdateQuery<CareProduct>,
  ): Promise<CareProduct | null> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedProductId = objectIdToString(productId);

    const filter: FilterQuery<CareProduct> = {
      _id: formattedProductId,
      ownerId: formattedOwnerId,
    };

    const options: QueryOptions<CareProduct> = { new: true };

    return await this.model.findOneAndUpdate(filter, update, options).exec();
  }

  async deleteByIdForOwner(ownerId: string, productId: string): Promise<boolean> {
    const formattedOwnerId = objectIdToString(ownerId);
    const formattedProductId = objectIdToString(productId);

    const filter: FilterQuery<CareProduct> = {
      _id: formattedProductId,
      ownerId: formattedOwnerId,
    };

    const result = await this.model.deleteOne(filter).exec();
    return result.deletedCount === 1;
  }
}
