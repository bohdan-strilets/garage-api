import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envValidation } from './configs/env.validation';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidation })],
})
export class AppModule {}
