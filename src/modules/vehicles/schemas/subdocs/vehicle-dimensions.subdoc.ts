import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehicleDimensions {
  @Prop({ type: Number, min: 0, default: null })
  lengthMm?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  widthMm?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  heightMm?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  wheelbaseMm?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  groundClearanceMm?: number | null;
}

export const VehicleDimensionsSchema = SchemaFactory.createForClass(VehicleDimensions);
