import { Prop, Schema } from '@nestjs/mongoose';

import { FuelType } from '../../enums';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class EnergyFuel {
  @Prop({ enum: FuelType, required: true })
  type: FuelType;

  @Prop({ type: Number, required: true, min: 0 })
  volumeLiters: number;

  @Prop({ type: Number, required: true, min: 0 })
  pricePerLiterPln: number;

  @Prop({ type: Boolean, default: false })
  isFull: boolean;
}
