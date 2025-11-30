import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PaginatedResult, PaginationOptions } from '@app/common/pagination';
import { VehiclesService } from '@app/modules/vehicles';

import { CareProductRepository } from './care-product.repository';
import { CreateCareProductDto, UpdateCareProductDto } from './dto';
import { CareProduct } from './schemas';
import { CareProductFilters, CareProductInput } from './types';

@Injectable()
export class CareProductsService {
  private readonly logger = new Logger(CareProductsService.name);

  constructor(
    private readonly repo: CareProductRepository,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async createForVehicle(
    ownerId: string,
    vehicleId: string,
    dto: CreateCareProductDto,
  ): Promise<CareProduct> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const input: CareProductInput = { ownerId, vehicleId, ...dto };
    return await this.repo.create(input);
  }

  async paginateForVehicle(
    ownerId: string,
    vehicleId: string,
    filters: CareProductFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<CareProduct>> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    return await this.repo.paginateForVehicle(ownerId, vehicleId, filters, pagination);
  }

  async getByIdForOwner(ownerId: string, productId: string): Promise<CareProduct> {
    const product = await this.repo.findByIdForOwner(ownerId, productId);

    if (!product) {
      this.logger.debug('Care care product not found');
      throw new NotFoundException('Car care product not found');
    }

    return product;
  }

  async updateForOwner(
    ownerId: string,
    productId: string,
    dto: UpdateCareProductDto,
  ): Promise<CareProduct> {
    const update: Partial<CareProductInput> = {
      name: dto.name,
      kind: dto.kind,
      quantity: dto.quantity,
      unit: dto.unit,
      price: dto.price,
      currency: dto.currency,
      purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
      note: dto.note,
    };

    const product = await this.repo.updateByIdForOwner(ownerId, productId, update);

    if (!product) {
      throw new NotFoundException('Car care product not found');
    }

    return product;
  }

  async deleteForOwner(ownerId: string, productId: string): Promise<boolean> {
    return await this.repo.deleteByIdForOwner(ownerId, productId);
  }
}
