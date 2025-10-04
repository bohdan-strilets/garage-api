import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  private readonly logger = new Logger(MongooseConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const uri = this.configService.get<string>('MONGO_URI');
    return {
      uri,
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => this.logger.debug('🔁 connected'));
        connection.on('open', () => this.logger.debug('✅ MongoDB connected'));

        return connection;
      },
    };
  }
}
