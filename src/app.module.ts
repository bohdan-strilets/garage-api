import { Module } from '@nestjs/common';
import { HealthModule } from './system/health/health.module';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
