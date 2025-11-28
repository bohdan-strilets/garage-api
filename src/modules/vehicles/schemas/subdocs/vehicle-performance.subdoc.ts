import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehiclePerformance {
  @Prop({ type: Number, min: 0, default: null })
  topSpeedKph?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  acceleration0100Sec?: number | null;
}

export const VehiclePerformanceSchema = SchemaFactory.createForClass(VehiclePerformance);
