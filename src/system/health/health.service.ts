import { Injectable, Logger } from '@nestjs/common';
import { HealthSuccess } from './types/health-success.type';

@Injectable()
export class HealthService {
  logger = new Logger('HealthService');

  async health(): Promise<HealthSuccess> {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    this.logger.debug(`Health check at ${timestamp}, uptime: ${uptime}s`);

    return {
      status: 'ok',
      timestamp,
      uptime,
    };
  }
}
