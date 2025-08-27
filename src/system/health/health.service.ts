import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { HealthSuccess } from './types/health-success.type';
import { ReadinessSuccess } from './types/readiness-success.type';

@Injectable()
export class HealthService {
  logger = new Logger('HealthService');

  constructor(@InjectConnection() private readonly connection: Connection) {}

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

  async readiness(): Promise<ReadinessSuccess> {
    if (this.connection.readyState !== 1) {
      this.logger.warn('Database connection is not ready');

      throw new ServiceUnavailableException('Database connection is not ready');
    }

    this.logger.debug('Readiness check passed');
    return { status: 'ready' };
  }
}
