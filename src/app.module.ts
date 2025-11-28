import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { MongoConfig } from './config/database';
import { EnvConfig } from './config/env';
import { ThrottlerConfig } from './config/throttling';
import { AuthModule } from './modules/auth';
import { CloudinaryModule } from './modules/cloudinary';
import { CryptoModule } from './modules/crypto';
import { EmailModule } from './modules/email';
import { MediaModule } from './modules/media';
import { PasswordModule } from './modules/password';
import { SessionModule } from './modules/session';
import { StatisticsModule } from './modules/statistics';
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
    EmailModule,
    CloudinaryModule,
    MediaModule,
    StatisticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
