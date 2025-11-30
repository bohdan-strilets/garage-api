import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { Currency } from '@app/common/enums';

import { MaintenanceKind, MaintenanceStatus } from '../enums';

import { MaintenancePart, MaintenancePartSchema } from './subdocs';

@Schema({ timestamps: true, versionKey: false })
export class Maintenance {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  vehicleId: Types.ObjectId;

  @Prop({ required: true, enum: MaintenanceKind, default: MaintenanceKind.REPAIR })
  kind: MaintenanceKind;

  @Prop({ required: true, enum: MaintenanceStatus, default: MaintenanceStatus.COMPLETED })
  status: MaintenanceStatus;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Number, required: true, min: 0 })
  odometer: number;

  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: String, default: null, trim: true })
  description?: string | null;

  @Prop({ type: Number, required: true, min: 0 })
  totalCost: number;

  @Prop({ enum: Currency, default: Currency.PLN })
  currency: Currency;

  @Prop({ type: String, default: null, trim: true })
  workshopName?: string | null;

  @Prop({ type: String, default: null, trim: true })
  serviceType?: string | null;

  @Prop({ type: Number, default: null, min: 0 })
  nextServiceOdometer?: number | null;

  @Prop({ type: Date, default: null })
  nextServiceDate?: Date | null;

  @Prop({ type: String, default: null, trim: true })
  repairArea?: string | null;

  @Prop({ type: Boolean, default: false })
  underWarranty?: boolean;

  @Prop({ type: Boolean, default: false })
  isAccidentRelated?: boolean;

  @Prop({ type: [MaintenancePartSchema], default: [] })
  parts: MaintenancePart[];

  updatedAt: Date;

  createdAt: Date;
}

export type MaintenanceDocument = HydratedDocument<Maintenance>;
export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);
