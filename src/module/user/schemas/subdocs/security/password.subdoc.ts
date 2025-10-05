import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class Password {
  @Prop({ type: String, required: true })
  hash: string;

  @Prop({ type: Date, required: true })
  updatedAt: Date;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: String, default: null })
  resetTokenHash?: string | null;

  @Prop({ type: Date, default: null })
  resetTokenExpiresAt?: Date | null;
}

export type PasswordDocument = HydratedDocument<Password>;
export const PasswordSchema = SchemaFactory.createForClass(Password);
