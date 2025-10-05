import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class EmailVerification {
  @Prop({ type: Boolean, default: false })
  isVerified?: boolean;

  @Prop({ type: String, default: null })
  verificationTokenHash?: string | null;

  @Prop({ type: Date, default: null })
  verificationTokenExpiresAt?: Date | null;
}

export type EmailVerificationDocument = HydratedDocument<EmailVerification>;
export const EmailVerificationSchema =
  SchemaFactory.createForClass(EmailVerification);
