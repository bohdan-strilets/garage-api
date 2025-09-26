import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class PasswordReset {
  @Prop({ type: String, default: null, select: false })
  tokenHash: string | null;

  @Prop({ type: Date, default: null })
  expiresAt?: Date | null;

  @Prop({ type: Date, default: null })
  usedAt?: Date | null;
}

export type PasswordResetDocument = HydratedDocument<PasswordReset>;
export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);
