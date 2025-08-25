import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envValidation } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation,
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
      },
      envFilePath: ['.env'],
    }),
  ],
})
export class AppModule {}
