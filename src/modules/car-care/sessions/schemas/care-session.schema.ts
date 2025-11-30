import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { Currency } from '@app/common/enums';

import { CareSessionKind } from '../enums';

@Schema({ collection: 'care_sessions', timestamps: true, versionKey: false })
export class CareSession {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  vehicleId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Number, default: null })
  odometer?: number | null;

  @Prop({ required: true, enum: CareSessionKind })
  kind: CareSessionKind;

  @Prop({ type: Number, default: null })
  price?: number | null;

  @Prop({ enum: Currency, default: Currency.PLN })
  currency: Currency;

  @Prop({ type: Number, default: null })
  durationMinutes?: number | null;

  @Prop({ type: String, trim: true, default: null })
  note?: string | null;
}

export type CareSessionDocument = HydratedDocument<CareSession>;
export const CareSessionSchema = SchemaFactory.createForClass(CareSession);
