import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { Currency } from '@app/common/enums';

import { CareUnit } from '../enums';
import { CareProductKind } from '../enums';

@Schema({ collection: 'care_products', timestamps: true, versionKey: false })
export class CareProduct {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  vehicleId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: CareProductKind })
  kind: CareProductKind;

  @Prop({ type: Number, required: false, default: null })
  quantity?: number | null;

  @Prop({ enum: CareUnit, default: CareUnit.OTHER })
  unit?: CareUnit;

  @Prop({ type: Number, default: null })
  price?: number | null;

  @Prop({ enum: Currency, default: Currency.PLN })
  currency: Currency;

  @Prop({ type: Date, default: null })
  purchaseDate?: Date | null;

  @Prop({ type: String, trim: true, default: null })
  note?: string | null;
}

export type CareProductDocument = HydratedDocument<CareProduct>;
export const CareProductSchema = SchemaFactory.createForClass(CareProduct);
