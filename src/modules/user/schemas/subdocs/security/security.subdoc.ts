import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { EmailVerification, EmailVerificationSchema } from './email-verification.subdoc';
import { Login, LoginSchema } from './login.subdoc';
import { Password, PasswordSchema } from './password.subdoc';

@Schema({ _id: false, versionKey: false })
export class Security {
  @Prop({ type: PasswordSchema, default: {} })
  password: Password;

  @Prop({ type: LoginSchema, default: {} })
  login: Login;

  @Prop({ type: EmailVerificationSchema, default: {} })
  emailVerification: EmailVerification;
}

export type SecurityDocument = HydratedDocument<Security>;
export const SecuritySchema = SchemaFactory.createForClass(Security);
