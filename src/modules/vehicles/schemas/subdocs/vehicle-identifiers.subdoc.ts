import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class VehicleIdentifiers {
  @Prop({ type: String, trim: true, uppercase: true, required: true })
  plateNumber: string;

  @Prop({ type: String, trim: true, uppercase: true, default: null })
  vin?: string | null;
}

export const VehicleIdentifiersSchema = SchemaFactory.createForClass(VehicleIdentifiers);
