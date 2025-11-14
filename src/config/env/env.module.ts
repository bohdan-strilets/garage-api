import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { resolveEnvFiles } from './env-paths';
import {
  appConfig,
  authLockoutConfig,
  cookieConfig,
  cryptoConfig,
  databaseConfig,
  securityConfig,
} from './name-space';
import { validationSchema } from './validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolveEnvFiles(),
      validationSchema,
      load: [
        appConfig,
        securityConfig,
        cookieConfig,
        databaseConfig,
        authLockoutConfig,
        cryptoConfig,
      ],
      cache: true,
    }),
  ],
  exports: [ConfigModule],
})
export class EnvConfig {}
