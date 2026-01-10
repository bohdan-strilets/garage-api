import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { EmailVerification, EmailVerificationSchema } from './email-verification';
import { PhoneVerification, PhoneVerificationSchema } from './phone-verification';

@Schema({ _id: false, timestamps: false })
export class Verification {
  @Prop({ type: EmailVerificationSchema, default: {} })
  email: EmailVerification;

  @Prop({ type: PhoneVerificationSchema, default: {} })
  phone: PhoneVerification;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
