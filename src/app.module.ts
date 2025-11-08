import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { envConfig } from './config/env';
import { throttlerConfig } from './config/throttling';
@Module({
  imports: [envConfig(), throttlerConfig()],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
