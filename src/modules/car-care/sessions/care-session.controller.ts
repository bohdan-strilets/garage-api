import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { Auth, CurrentUserId } from '@app/common/decorators';
import { SuccessMessage } from '@app/common/http/decorators';
import { PaginatedResult, PaginationOptions } from '@app/common/pagination';

import { CareSessionsService } from './care-session.service';
import { CreateCareSessionDto, UpdateCareSessionDto } from './dto';
import { CareSessionKind } from './enums';
import { CareSession } from './schemas';
import { CareSessionFilters } from './types';

@Auth()
@Controller('car-care/sessions')
export class CareSessionsController {
  constructor(private readonly service: CareSessionsService) {}

  @Post(':vehicleId')
  async createForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateCareSessionDto,
  ): Promise<CareSession> {
    return await this.service.createForVehicle(ownerId, vehicleId, dto);
  }

  @Get('vehicle/:vehicleId')
  async paginateForVehicle(
    @CurrentUserId() ownerId: string,
    @Param('vehicleId') vehicleId: string,
    @Query() pagination: PaginationOptions,
    @Query('kind') kind?: CareSessionKind,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('odometerMin') odometerMin?: string,
    @Query('odometerMax') odometerMax?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
  ): Promise<PaginatedResult<CareSession>> {
    const filters: CareSessionFilters = {
      kind,
      dateFrom,
      dateTo,
      odometerMin,
      odometerMax,
      priceMin,
      priceMax,
    };

    return await this.service.paginateForVehicle(ownerId, vehicleId, filters, pagination);
  }

  @Get(':sessionId')
  async getById(
    @CurrentUserId() ownerId: string,
    @Param('sessionId') sessionId: string,
  ): Promise<CareSession> {
    return await this.service.getByIdForOwner(ownerId, sessionId);
  }

  @Patch(':sessionId')
  async update(
    @CurrentUserId() ownerId: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateCareSessionDto,
  ): Promise<CareSession> {
    return await this.service.updateForOwner(ownerId, sessionId, dto);
  }

  @Delete(':sessionId')
  @SuccessMessage('Car care session deleted')
  async delete(
    @CurrentUserId() ownerId: string,
    @Param('sessionId') sessionId: string,
  ): Promise<void> {
    await this.service.deleteForOwner(ownerId, sessionId);
  }
}
