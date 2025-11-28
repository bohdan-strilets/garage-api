import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Currency } from '@app/common/enums';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehiclePurchase {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Number, min: 0, default: null })
  price?: number | null;

  @Prop({ enum: Currency, default: Currency.PLN })
  currency: Currency;
}

export const VehiclePurchaseSchema = SchemaFactory.createForClass(VehiclePurchase);
