import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: false, versionKey: false, _id: false })
export class Safety {
  @Prop({ type: Date, default: null })
  lastLoginAt?: Date | null;

  @Prop({ type: Number, default: 0 })
  loginFails?: number;

  @Prop({ type: Date, default: null })
  lockedUntil?: Date | null;

  @Prop({ type: Boolean, default: false })
  emailVerified?: boolean;

  @Prop({ type: String, default: null, select: false })
  emailVerifyTokenHash?: string | null;

  @Prop({ type: Date, default: null })
  emailVerifySentAt?: Date | null;

  @Prop({ type: String, default: null, select: false })
  passwordResetTokenHash?: string | null;

  @Prop({ type: Date, default: null })
  passwordResetRequestedAt?: Date | null;
}

export type SafetyDocument = HydratedDocument<Safety>;
export const SafetySchema = SchemaFactory.createForClass(Safety);
