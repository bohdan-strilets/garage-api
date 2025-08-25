import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { envValidation } from './config/env.validation';
import mongoConfig from './config/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig],
      validationSchema: envValidation,
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
      },
      envFilePath: ['.env'],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.uri'),
      }),
    }),
  ],
})
export class AppModule {}
