import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { Auth, CurrentUserId } from '@app/common/decorators';
import { SuccessMessage } from '@app/common/http/decorators';
import { PaginatedResult, PaginationOptions } from '@app/common/pagination';

import { CreateVehicleDto, UpdateVehicleDto } from './dto';
import { VehicleSelf } from './types';
import { VehiclesService } from './vehicles.service';

@Auth()
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  async create(
    @CurrentUserId() ownerId: string,
    @Body() dto: CreateVehicleDto,
  ): Promise<VehicleSelf> {
    return await this.vehiclesService.createForOwner(ownerId, dto);
  }

  @Get(':vehicleId')
  async getById(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
  ): Promise<VehicleSelf> {
    return await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);
  }

  @Get()
  async getList(
    @CurrentUserId() ownerId: string,
    @Query() pagination: PaginationOptions,
  ): Promise<PaginatedResult<VehicleSelf>> {
    return await this.vehiclesService.getListForOwner(ownerId, pagination);
  }

  @Patch(':vehicleId')
  async update(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleSelf> {
    return await this.vehiclesService.updateForOwner(ownerId, vehicleId, dto);
  }

  @Delete(':vehicleId')
  @SuccessMessage('Vehicle deleted successfully')
  async delete(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
  ): Promise<void> {
    await this.vehiclesService.deleteForOwner(ownerId, vehicleId);
  }
}
