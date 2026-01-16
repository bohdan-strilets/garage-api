import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { OdometerUnit } from '../../enums';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehicleOdometer {
  @Prop({ type: Number, min: 0, required: true })
  initial: number;

  @Prop({ type: Date, required: true })
  initialRecordedAt: Date;

  @Prop({ type: Number, min: 0, required: true })
  current: number;

  @Prop({ type: Date, required: true })
  currentRecordedAt: Date;

  @Prop({ enum: OdometerUnit, required: true })
  unit: OdometerUnit;

  @Prop({ type: Number, min: 0, default: null })
  targetAnnualMileage?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  serviceInterval?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  nextServiceMileage?: number | null;
}

export const VehicleOdometerSchema = SchemaFactory.createForClass(VehicleOdometer);
