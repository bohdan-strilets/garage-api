import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [MongooseModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
