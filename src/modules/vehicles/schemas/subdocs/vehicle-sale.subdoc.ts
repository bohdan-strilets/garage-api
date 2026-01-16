import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Currency } from '@app/common/enums';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehicleSale {
  @Prop({ type: Boolean, default: false })
  isSold?: boolean;

  @Prop({ type: Date, default: null })
  date?: Date | null;

  @Prop({ type: Number, min: 0, default: null })
  price?: number | null;

  @Prop({ enum: Currency, default: null })
  currency?: Currency | null;
}

export const VehicleSaleSchema = SchemaFactory.createForClass(VehicleSale);
