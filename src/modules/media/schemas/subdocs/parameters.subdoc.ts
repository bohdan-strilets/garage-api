import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class Parameters {
  @Prop({ type: String, required: true })
  format: string;

  @Prop({ type: Number, required: true })
  bytes: number;

  @Prop({ type: Number, default: null })
  width?: number | null;

  @Prop({ type: Number, default: null })
  height?: number | null;

  @Prop({ type: Number, default: null })
  duration?: number | null;
}

export type ParametersDocument = HydratedDocument<Parameters>;
export const ParametersSchema = SchemaFactory.createForClass(Parameters);
