import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig, authConfig, cookiesConfig, corsConfig, databaseConfig } from './nameSpaces';
import { envValidationSchema } from './validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, corsConfig, cookiesConfig],
      envFilePath: (() => {
        const env = process.env.NODE_ENV ?? 'development';
        return env === 'production' ? '.env.production' : '.env.development';
      })(),
      validationSchema: envValidationSchema,
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
