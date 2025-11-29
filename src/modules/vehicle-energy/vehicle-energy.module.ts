import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VehiclesModule } from '../vehicles';

import { EnergySession, EnergySessionSchema } from './schemas';
import { VehicleEnergyController } from './vehicle-energy.controller';
import { VehicleEnergyRepository } from './vehicle-energy.repository';
import { VehicleEnergyService } from './vehicle-energy.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EnergySession.name, schema: EnergySessionSchema }]),
    VehiclesModule,
  ],
  controllers: [VehicleEnergyController],
  providers: [VehicleEnergyService, VehicleEnergyRepository],
  exports: [VehicleEnergyService],
})
export class VehicleEnergyModule {}
