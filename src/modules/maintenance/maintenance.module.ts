import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VehiclesModule } from '../vehicles';

import { MaintenanceController } from './maintenance.controller';
import { MaintenanceRepository } from './maintenance.repository';
import { MaintenanceService } from './maintenance.service';
import { Maintenance, MaintenanceSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Maintenance.name, schema: MaintenanceSchema }]),
    VehiclesModule,
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceRepository],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
