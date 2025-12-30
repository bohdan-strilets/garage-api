import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VehiclesModule } from '../vehicles';

import { EnergyController } from './energy.controller';
import { EnergyRepository } from './energy.repository';
import { EnergyService } from './energy.service';
import { EnergySession, EnergySessionSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EnergySession.name, schema: EnergySessionSchema }]),
    VehiclesModule,
  ],
  controllers: [EnergyController],
  providers: [EnergyService, EnergyRepository],
  exports: [EnergyService],
})
export class EnergyModule {}
