import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehicleCapacity {
  @Prop({ type: Number, min: 0, default: null })
  trunkVolumeMinL?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  trunkVolumeMaxL?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  curbWeightKg?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  grossWeightKg?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  maxPayloadKg?: number | null;
}

export const VehicleCapacitySchema = SchemaFactory.createForClass(VehicleCapacity);
