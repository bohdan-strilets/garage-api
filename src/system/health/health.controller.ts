import { Controller, Get, HttpCode } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthSuccess } from './types/health-success.type';
import { ReadinessSuccess } from './types/readiness-success.type';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  @HttpCode(200)
  async health(): Promise<HealthSuccess> {
    return this.healthService.health();
  }

  @Get('readiness')
  async readiness(): Promise<ReadinessSuccess> {
    return this.healthService.readiness();
  }
}
