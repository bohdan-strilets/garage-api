import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MileageEventType } from '../types/mileage-event.type';

export type MileageDocument = HydratedDocument<Mileage>;

@Schema({ versionKey: false, _id: false })
export class Mileage {
  @Prop({ default: 0 })
  afterBuying: number;

  @Prop({ default: [] })
  latest: MileageEventType[];
}
