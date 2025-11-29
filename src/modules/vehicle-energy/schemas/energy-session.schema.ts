import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { Currency } from '@app/common/enums';

import { EnergyKind } from '../enums';

import { EnergyCharge, EnergyFuel } from './subdocs';

@Schema({ collection: 'energy-sessions', timestamps: true, versionKey: false })
export class EnergySession {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true, index: true })
  vehicleId: Types.ObjectId;

  @Prop({ enum: EnergyKind, required: true })
  kind: EnergyKind;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Number, required: true, min: 0 })
  odometerKm: number;

  @Prop({ type: Number, required: true, min: 0 })
  totalCostPln: number;

  @Prop({ enum: Currency, default: Currency.PLN })
  currency: Currency;

  @Prop({ type: String, required: true })
  stationName: string;

  @Prop({ type: String, default: null })
  notes?: string | null;

  @Prop({ type: EnergyFuel, required: false })
  fuel?: EnergyFuel | null;

  @Prop({ type: EnergyCharge, required: false })
  charge?: EnergyCharge | null;

  updatedAt: Date;

  createdAt: Date;
}

export type EnergySessionDocument = HydratedDocument<EnergySession>;
export const EnergySessionSchema = SchemaFactory.createForClass(EnergySession);

EnergySessionSchema.index({ vehicleId: 1, date: -1 });
EnergySessionSchema.index({ vehicleId: 1, odometerKm: 1 });
