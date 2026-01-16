import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { User } from '@app/modules/user/schemas';

import { vehicleRules } from '../config';
import { VehicleStatus } from '../enums';

import {
  VehicleIdentifiers,
  VehicleIdentifiersSchema,
  VehicleOdometer,
  VehicleOdometerSchema,
  VehiclePurchase,
  VehiclePurchaseSchema,
  VehicleSale,
  VehicleSaleSchema,
  VehicleTechnical,
  VehicleTechnicalSchema,
} from './subdocs';

@Schema({ collection: 'vehicles', timestamps: true, versionKey: false })
export class Vehicle {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ type: String, trim: true, default: null })
  name?: string | null;

  @Prop({ type: String, trim: true, required: true, index: true })
  brand: string;

  @Prop({ type: String, trim: true, required: true, index: true })
  model: string;

  @Prop({ type: String, trim: true, default: null })
  generation?: string | null;

  @Prop({
    type: Number,
    min: vehicleRules.base.year.min,
    max: vehicleRules.base.year.max,
    required: true,
  })
  year: number;

  @Prop({ type: VehicleIdentifiersSchema, required: true })
  identifiers: VehicleIdentifiers;

  @Prop({ type: VehicleOdometerSchema, required: true })
  odometer: VehicleOdometer;

  @Prop({ type: VehiclePurchaseSchema, required: true })
  purchase: VehiclePurchase;

  @Prop({ type: VehicleSaleSchema, required: true })
  sale: VehicleSale;

  @Prop({ type: VehicleTechnicalSchema, required: true })
  technical: VehicleTechnical;

  @Prop({ type: String, trim: true, default: null })
  notes?: string | null;

  @Prop({ enum: VehicleStatus, default: VehicleStatus.ACTIVE, index: true })
  status: VehicleStatus;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Date, required: false, default: null })
  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type VehicleDocument = HydratedDocument<Vehicle>;
export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.index(
  { ownerId: 1, 'identifiers.plateNumber': 1, isDeleted: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

VehicleSchema.index({ ownerId: 1, brand: 1, model: 1, year: 1, isDeleted: 1 });
