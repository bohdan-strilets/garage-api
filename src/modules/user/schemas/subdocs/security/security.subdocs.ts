import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { EmailVerification, EmailVerificationSchema } from './email-verification.subdocs';
import { LoginGuard, LoginGuardSchema } from './login-guard.subdocs';
import { PasswordReset, PasswordResetSchema } from './password-reset.subdocs';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class Security {
  @Prop({ type: String, required: true, select: false })
  passwordHash: string;

  @Prop({ type: Date, default: null })
  passwordChangedAt?: Date | null;

  @Prop({ type: EmailVerificationSchema })
  emailVerification?: EmailVerification;

  @Prop({ type: PasswordResetSchema })
  passwordReset?: PasswordReset;

  @Prop({ type: LoginGuardSchema })
  loginGuard?: LoginGuard;
}

export type SecurityDocument = HydratedDocument<Security>;
export const SecuritySchema = SchemaFactory.createForClass(Security);
