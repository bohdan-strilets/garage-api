import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { resolveEnvFiles } from './env-paths';
import {
  appConfig,
  authLockoutConfig,
  cookieConfig,
  cryptoConfig,
  databaseConfig,
  emailConfig,
  securityConfig,
  tokensConfig,
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
        tokensConfig,
        emailConfig,
      ],
      cache: true,
    }),
  ],
  exports: [ConfigModule],
})
export class EnvConfig {}
