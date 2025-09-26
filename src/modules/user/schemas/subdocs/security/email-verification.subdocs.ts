import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class EmailVerification {
  @Prop({ type: Date, default: null })
  verifiedAt?: Date | null;

  @Prop({ type: String, default: null, select: false })
  tokenHash?: string | null;

  @Prop({ type: Date, default: null })
  expiresAt?: Date | null;
}

export type EmailVerificationDocument = HydratedDocument<EmailVerification>;
export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);
