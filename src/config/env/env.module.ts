import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { resolveEnvFiles } from './env-paths';
import { appConfig, cookieConfig, databaseConfig, securityConfig } from './name-space';
import { validationSchema } from './validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolveEnvFiles(),
      validationSchema,
      load: [appConfig, securityConfig, cookieConfig, databaseConfig],
      cache: true,
    }),
  ],
  exports: [ConfigModule],
})
export class EnvConfig {}
