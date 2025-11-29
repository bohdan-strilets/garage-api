import { Prop, Schema } from '@nestjs/mongoose';

import { ChargerType } from '../../enums';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class EnergyCharge {
  @Prop({ enum: ChargerType, required: true })
  type: ChargerType;

  @Prop({ type: Number, required: true, min: 0 })
  energyKwh: number;

  @Prop({ type: Number, required: true, min: 0 })
  pricePerKwhPln: number;

  @Prop({ type: Number, required: false, min: 0 })
  powerKw?: number;

  @Prop({ type: Number, required: false, min: 0 })
  durationMinutes?: number;

  @Prop({ type: Boolean, default: false })
  isFull: boolean;
}
