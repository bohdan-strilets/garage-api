import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class LoginGuard {
  @Prop({ type: Number, default: 0 })
  failedAttempts?: number;

  @Prop({ type: Date, default: null })
  lockUntil?: Date | null;
}

export type LoginGuardDocument = HydratedDocument<LoginGuard>;
export const LoginGuardSchema = SchemaFactory.createForClass(LoginGuard);
