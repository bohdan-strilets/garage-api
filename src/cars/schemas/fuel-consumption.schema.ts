import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FuelConsumptionDocument = HydratedDocument<FuelConsumption>;

@Schema({ versionKey: false, _id: false })
export class FuelConsumption {
  @Prop({ default: 0 })
  city: number;

  @Prop({ default: 0 })
  highway: number;

  @Prop({ default: 0 })
  mixed: number;
}
