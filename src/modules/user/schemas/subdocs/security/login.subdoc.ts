import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class Login {
  @Prop({ type: Date, default: null })
  lastLoginAt?: Date | null;

  @Prop({ type: Number, default: 0 })
  failedAttempts?: number;

  @Prop({ type: Date, default: null })
  lockUntil?: Date | null;
}

export type LoginDocument = HydratedDocument<Login>;
export const LoginSchema = SchemaFactory.createForClass(Login);
