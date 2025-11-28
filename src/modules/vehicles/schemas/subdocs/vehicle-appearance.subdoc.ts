import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehicleAppearance {
  @Prop({ type: String, trim: true, default: null })
  bodyColor?: string | null;

  @Prop({ type: String, trim: true, default: null })
  interiorColor?: string | null;
}

export const VehicleAppearanceSchema = SchemaFactory.createForClass(VehicleAppearance);
