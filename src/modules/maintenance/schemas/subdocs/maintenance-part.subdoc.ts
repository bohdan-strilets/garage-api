import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class MaintenancePart {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, trim: true, default: null })
  partNumber?: string | null;

  @Prop({ type: Number, required: true, min: 0 })
  unitPrice: number;

  @Prop({ type: Number, required: true, min: 0 })
  quantity: number;
}

export const MaintenancePartSchema = SchemaFactory.createForClass(MaintenancePart);
