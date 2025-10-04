import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationEnv } from './configs/env/validation-env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationEnv,
    }),
  ],
})
export class AppModule {}
