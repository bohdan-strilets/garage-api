import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { Auth, CurrentUserId } from '@app/common/decorators';
import { SuccessMessage } from '@app/common/http/decorators';
import { PaginatedResult, PaginationOptions } from '@app/common/pagination';

import { CareProductsService } from './care-product.service';
import { CreateCareProductDto, UpdateCareProductDto } from './dto';
import { CareProductKind } from './enums';
import { CareProduct } from './schemas';
import { CareProductFilters } from './types';

@Auth()
@Controller('car-care/products')
export class CareProductsController {
  constructor(private readonly service: CareProductsService) {}

  @Post(':vehicleId')
  async createForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateCareProductDto,
  ): Promise<CareProduct> {
    return await this.service.createForVehicle(ownerId, vehicleId, dto);
  }

  @Get('vehicle/:vehicleId')
  async paginateForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Query() pagination: PaginationOptions,
    @Query('kind') kind?: CareProductKind,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
  ): Promise<PaginatedResult<CareProduct>> {
    const filters: CareProductFilters = {
      kind,
      dateFrom,
      dateTo,
      priceMin,
      priceMax,
    };

    return await this.service.paginateForVehicle(ownerId, vehicleId, filters, pagination);
  }

  @Get(':productId')
  async getById(
    @CurrentUserId() ownerId: string,
    @Param('productId') productId: string,
  ): Promise<CareProduct> {
    return await this.service.getByIdForOwner(ownerId, productId);
  }

  @Patch(':productId')
  async update(
    @CurrentUserId() ownerId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCareProductDto,
  ): Promise<CareProduct> {
    return await this.service.updateForOwner(ownerId, productId, dto);
  }

  @Delete(':productId')
  @SuccessMessage('Car care product deleted')
  async delete(
    @CurrentUserId() ownerId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    await this.service.deleteForOwner(ownerId, productId);
  }
}
