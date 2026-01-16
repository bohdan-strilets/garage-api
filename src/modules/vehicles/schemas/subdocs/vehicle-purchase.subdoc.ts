import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Currency } from '@app/common/enums';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehiclePurchase {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Number, min: 0, required: true })
  price: number;

  @Prop({ enum: Currency, required: true })
  currency: Currency;
}

export const VehiclePurchaseSchema = SchemaFactory.createForClass(VehiclePurchase);
