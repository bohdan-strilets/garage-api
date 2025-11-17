import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { MongoConfig } from './config/database';
import { EnvConfig } from './config/env';
import { ThrottlerConfig } from './config/throttling';
import { AuthModule } from './modules/auth';
import { CryptoModule } from './modules/crypto';
import { PasswordModule } from './modules/password';
import { SessionModule } from './modules/session';
import { TokensModule } from './modules/tokens';
import { UserModule } from './modules/user';
@Module({
  imports: [
    EnvConfig,
    ThrottlerConfig,
    MongoConfig,
    UserModule,
    SessionModule,
    CryptoModule,
    TokensModule,
    PasswordModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
