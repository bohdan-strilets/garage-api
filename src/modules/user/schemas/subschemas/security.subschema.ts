import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: false, versionKey: false, _id: false })
export class Security {
  @Prop({ type: Date, default: null })
  passwordChangedAt?: Date | null;

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date | null;

  @Prop({ type: Number, default: 0 })
  loginFailedCount: number;

  @Prop({ type: Date, default: null })
  lockedUntil?: Date | null;
}

export type SecurityDocument = HydratedDocument<Security>;
export const SecuritySchema = SchemaFactory.createForClass(Security);
