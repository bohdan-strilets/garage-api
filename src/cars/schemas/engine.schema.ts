import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { FuelEnum } from '../enums/fuel.enum';
import { FuelConsumption, FuelConsumptionDocument } from './fuel-consumption.schema';

export type EngineDocument = HydratedDocument<Engine>;

@Schema({ versionKey: false, _id: false })
export class Engine {
  @Prop({ default: 0 })
  afterBuying: number;

  @Prop({ default: 0 })
  engineCapacity: number;

  @Prop({ default: 0 })
  enginePower: number;

  @Prop({ default: FuelEnum.OTHER, enum: FuelEnum })
  fuelType: FuelEnum;

  @Prop({ type: FuelConsumption, default: {} })
  fuelConsumption: FuelConsumptionDocument;
}
