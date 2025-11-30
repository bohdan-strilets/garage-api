import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { MongoConfig } from './config/database';
import { EnvConfig } from './config/env';
import { ThrottlerConfig } from './config/throttling';
import { AuthModule } from './modules/auth';
import { CarCareModule } from './modules/car-care';
import { CloudinaryModule } from './modules/cloudinary';
import { CryptoModule } from './modules/crypto';
import { EmailModule } from './modules/email';
import { MaintenanceModule } from './modules/maintenance';
import { MediaModule } from './modules/media';
import { PasswordModule } from './modules/password';
import { SessionModule } from './modules/session';
import { StatisticsModule } from './modules/statistics';
import { TokensModule } from './modules/tokens';
import { UserModule } from './modules/user';
import { VehicleEnergyModule } from './modules/vehicle-energy';
import { VehiclesModule } from './modules/vehicles';
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
    VehiclesModule,
    VehicleEnergyModule,
    MaintenanceModule,
    CarCareModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
