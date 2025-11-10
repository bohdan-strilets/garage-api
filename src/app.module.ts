import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { MongoConfig } from './config/database';
import { EnvConfig } from './config/env';
import { ThrottlerConfig } from './config/throttling';
import { UserModule } from './modules/user';
@Module({
  imports: [EnvConfig, ThrottlerConfig, MongoConfig, UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
