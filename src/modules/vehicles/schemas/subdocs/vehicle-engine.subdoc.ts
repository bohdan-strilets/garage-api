import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehicleEngine {
  @Prop({ type: Number, min: 1, default: null })
  displacementCc?: number | null;

  @Prop({ type: Number, min: 1, default: null })
  powerHp?: number | null;

  @Prop({ type: Number, min: 1, default: null })
  powerKw?: number | null;

  @Prop({ type: Number, min: 1, default: null })
  torqueNm?: number | null;

  @Prop({ type: Number, min: 1, default: null })
  cylinders?: number | null;
}

export const VehicleEngineSchema = SchemaFactory.createForClass(VehicleEngine);
