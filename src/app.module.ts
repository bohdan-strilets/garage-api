import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { envValidation } from './configs/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { PasswordModule } from './modules/password/password.module';
import { TokenModule } from './modules/token/token.module';
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './system/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidation }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const ttl = config.get<number>('RATE_TTL');
        const limit = config.get<number>('RATE_LIMIT');
        return [{ ttl: ttl * 1000, limit: Number(limit) }];
      },
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    HealthModule,
    UserModule,
    AuthModule,
    PasswordModule,
    TokenModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
