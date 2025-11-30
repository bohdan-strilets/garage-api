import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PaginatedResult, PaginationOptions } from '@app/common/pagination';
import { VehiclesService } from '@app/modules/vehicles';

import { CareSessionRepository } from './care-session.repository';
import { CreateCareSessionDto, UpdateCareSessionDto } from './dto';
import { CareSession } from './schemas';
import { CareSessionFilters, CareSessionInput } from './types';

@Injectable()
export class CareSessionsService {
  private readonly logger = new Logger(CareSessionsService.name);

  constructor(
    private readonly repo: CareSessionRepository,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async createForVehicle(
    ownerId: string,
    vehicleId: string,
    dto: CreateCareSessionDto,
  ): Promise<CareSession> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    const input: CareSessionInput = { ownerId, vehicleId, ...dto };
    return await this.repo.create(input);
  }

  async paginateForVehicle(
    ownerId: string,
    vehicleId: string,
    filters: CareSessionFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<CareSession>> {
    await this.vehiclesService.getByIdForOwner(ownerId, vehicleId);

    return await this.repo.paginateForVehicle(ownerId, vehicleId, filters, pagination);
  }

  async getByIdForOwner(ownerId: string, sessionId: string): Promise<CareSession> {
    const session = await this.repo.findByIdForOwner(ownerId, sessionId);

    if (!session) {
      this.logger.debug('Car care session not found');
      throw new NotFoundException('Car care session not found');
    }

    return session;
  }

  async updateForOwner(
    ownerId: string,
    sessionId: string,
    dto: UpdateCareSessionDto,
  ): Promise<CareSession> {
    const update: Partial<CareSessionInput> = {
      date: dto.date ? new Date(dto.date) : undefined,
      odometer: dto.odometer,
      kind: dto.kind,
      price: dto.price,
      currency: dto.currency,
      durationMinutes: dto.durationMinutes,
      note: dto.note,
    };

    const session = await this.repo.updateByIdForOwner(ownerId, sessionId, update);

    if (!session) {
      this.logger.debug('Car care session not found for update');
      throw new NotFoundException('Car care session not found');
    }

    return session;
  }

  async deleteForOwner(ownerId: string, sessionId: string): Promise<void> {
    await this.repo.deleteByIdForOwner(ownerId, sessionId);
  }
}
