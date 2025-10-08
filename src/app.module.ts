import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { validationEnv } from './configs/env/validation-env.config';
import { MongooseConfigService } from './configs/mongoose/mongoose.config';
import { AuthModule } from './module/auth';
import { JwtAuthGuard } from './module/auth/guards/jwt-auth.guard';
import { RolesGuard } from './module/auth/guards/roles.guard';
import { CryptoModule } from './module/crypto';
import { PasswordModule } from './module/password';
import { SessionsModule } from './module/sessions';
import { TokenModule } from './module/token';
import { UserModule } from './module/user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationEnv,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    CryptoModule,
    PasswordModule,
    UserModule,
    SessionsModule,
    TokenModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
