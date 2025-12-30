import { Injectable, Logger } from '@nestjs/common';

import { maintenanceRecordNotFound } from '@app/common/errors';
import { PaginatedResult, PaginationOptions } from '@app/common/pagination';

import { VehiclesService } from '../vehicles';

import { CreateMaintenanceDto, UpdateMaintenanceDto } from './dto';
import { MaintenanceKind, MaintenanceStatus } from './enums';
import { MaintenanceRepository } from './maintenance.repository';
import { Maintenance } from './schemas';
import { MaintenanceInput } from './types';
import { MaintenanceFilters } from './types/maintenance-filters.type';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(
    private readonly repo: MaintenanceRepository,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async createForVehicle(
    ownerId: string,
    vehicleId: string,
    dto: CreateMaintenanceDto,
  ): Promise<Maintenance> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const input: MaintenanceInput = { ownerId, vehicleId, ...dto };
    return await this.repo.createForVehicle(input);
  }

  async updateForVehicle(
    ownerId: string,
    vehicleId: string,
    maintenanceId: string,
    dto: UpdateMaintenanceDto,
  ): Promise<Maintenance> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const input: MaintenanceInput = { ownerId, vehicleId, ...dto };

    const updated = await this.repo.updateForVehicle(maintenanceId, input);

    if (!updated) {
      this.logger.debug('Maintenance record not found for update');
      maintenanceRecordNotFound();
    }

    return updated;
  }

  async deleteForVehicle(
    ownerId: string,
    vehicleId: string,
    maintenanceId: string,
  ): Promise<boolean> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const existing = await this.repo.findByIdForVehicle(ownerId, vehicleId, maintenanceId);

    if (!existing) {
      this.logger.debug('Maintenance record not found for deletion');
      maintenanceRecordNotFound();
    }

    return await this.repo.deleteForVehicle(ownerId, vehicleId, maintenanceId);
  }

  async getByIdForVehicle(
    ownerId: string,
    vehicleId: string,
    maintenanceId: string,
  ): Promise<Maintenance> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const existing = await this.repo.findByIdForVehicle(ownerId, vehicleId, maintenanceId);

    if (!existing) {
      this.logger.debug('Maintenance record not found');
      maintenanceRecordNotFound();
    }

    return existing;
  }

  async getForVehicle(
    ownerId: string,
    vehicleId: string,
    pagination: PaginationOptions,
    kind?: MaintenanceKind,
    status?: MaintenanceStatus,
    dateFrom?: string,
    dateTo?: string,
    odometerMin?: string,
    odometerMax?: string,
  ): Promise<PaginatedResult<Maintenance>> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const filters: MaintenanceFilters = {};

    if (kind) filters.kind = kind;
    if (status) filters.status = status;

    if (dateFrom) {
      filters.dateFrom = new Date(dateFrom);
    }

    if (dateTo) {
      filters.dateTo = new Date(dateTo);
    }

    if (odometerMin !== undefined) {
      filters.odometerMin = odometerMin;
    }

    if (odometerMax !== undefined) {
      filters.odometerMax = odometerMax;
    }

    return await this.repo.paginateForVehicle(ownerId, vehicleId, filters, pagination);
  }
}
