import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@modules/auth';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { CryptoModule } from '@modules/crypto';
import { PasswordModule } from '@modules/password';
import { SessionsModule } from '@modules/sessions';
import { TokenModule } from '@modules/token';
import { UserModule } from '@modules/user';

import { GlobalExceptionFilter } from '@configs/errors';
import { JwtConfigModule } from '@configs/jwt/jwt.config';

import { validationEnv } from './configs/env/validation-env.config';
import { MongooseConfigService } from './configs/mongoose/mongoose.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationEnv,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    JwtConfigModule,
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
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
