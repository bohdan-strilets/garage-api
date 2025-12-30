import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { Auth, CurrentUserId } from '@app/common/decorators';
import { SuccessMessage } from '@app/common/http/decorators';
import { PaginatedResult, PaginationOptions } from '@app/common/pagination';

import { CreateEnergySessionDto, UpdateEnergySessionDto } from './dto';
import { EnergyService } from './energy.service';
import { EnergyKind } from './enums';
import { EnergySession } from './schemas';

@Auth()
@Controller('vehicle-energy')
export class EnergyController {
  constructor(private readonly service: EnergyService) {}

  @Post(':vehicleId')
  async createForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateEnergySessionDto,
  ): Promise<EnergySession> {
    return await this.service.createForVehicle(ownerId, vehicleId, dto);
  }

  @Patch(':vehicleId/:sessionId')
  async updateForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateEnergySessionDto,
  ): Promise<EnergySession> {
    return await this.service.updateForOwner(ownerId, vehicleId, sessionId, dto);
  }

  @Get(':vehicleId')
  async getForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Query() pagination: PaginationOptions,
    @Query('kind') kind: EnergyKind,
  ): Promise<PaginatedResult<EnergySession>> {
    return await this.service.getForVehicle(ownerId, vehicleId, pagination, kind);
  }

  @Get(':vehicleId/:sessionId')
  async getById(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Param('sessionId') sessionId: string,
  ): Promise<EnergySession> {
    return await this.service.getByIdForOwner(ownerId, vehicleId, sessionId);
  }

  @Delete(':vehicleId/:sessionId')
  @SuccessMessage('Energy session deleted')
  async delete(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Param('sessionId') sessionId: string,
  ): Promise<void> {
    return await this.service.deleteForOwner(ownerId, vehicleId, sessionId);
  }
}
