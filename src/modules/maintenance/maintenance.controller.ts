import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { Auth, CurrentUserId } from '@app/common/decorators';
import { SuccessMessage } from '@app/common/http/decorators';
import { PaginatedResult, PaginationOptions } from '@app/common/pagination';

import { CreateMaintenanceDto, UpdateMaintenanceDto } from './dto';
import { MaintenanceKind, MaintenanceStatus } from './enums';
import { MaintenanceService } from './maintenance.service';
import { Maintenance } from './schemas';

@Auth()
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly service: MaintenanceService) {}

  @Post(':vehicleId')
  async createForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateMaintenanceDto,
  ): Promise<Maintenance> {
    return await this.service.createForVehicle(ownerId, vehicleId, dto);
  }

  @Patch(':vehicleId/:maintenanceId')
  async updateForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Param('maintenanceId') maintenanceId: string,
    @Body() dto: UpdateMaintenanceDto,
  ): Promise<Maintenance> {
    return await this.service.updateForVehicle(ownerId, vehicleId, maintenanceId, dto);
  }

  @Delete(':vehicleId/:maintenanceId')
  @SuccessMessage('Maintenance record deleted successfully')
  async deleteForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Param('maintenanceId') maintenanceId: string,
  ): Promise<void> {
    await this.service.deleteForVehicle(ownerId, vehicleId, maintenanceId);
  }

  @Get(':vehicleId/:maintenanceId')
  async getByIdForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Param('maintenanceId') maintenanceId: string,
  ): Promise<Maintenance> {
    return await this.service.getByIdForVehicle(ownerId, vehicleId, maintenanceId);
  }

  @Get(':vehicleId')
  async getForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Query() pagination: PaginationOptions,
    @Query('kind') kind?: MaintenanceKind,
    @Query('status') status?: MaintenanceStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('odometerMin') odometerMin?: string,
    @Query('odometerMax') odometerMax?: string,
  ): Promise<PaginatedResult<Maintenance>> {
    return await this.service.getForVehicle(
      ownerId,
      vehicleId,
      pagination,
      kind,
      status,
      dateFrom,
      dateTo,
      odometerMin,
      odometerMax,
    );
  }
}
