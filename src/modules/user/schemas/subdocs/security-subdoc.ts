import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Password, PasswordSchema } from './password.subdoc';

@Schema({ _id: false, timestamps: false })
export class Security {
  @Prop({ type: PasswordSchema, default: {} })
  password: Password;

  @Prop({ type: Number, default: 0, min: 0, select: false })
  failedLoginAttempts: number;

  @Prop({ type: Date, default: null, select: false })
  lastFailedAt?: Date | null;

  @Prop({ type: Date, default: null, select: false })
  lockedUntilAt?: Date | null;
}

export const SecuritySchema = SchemaFactory.createForClass(Security);
