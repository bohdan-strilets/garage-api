import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class Password {
  @Prop({ type: String, required: true })
  hashedPassword: string;

  @Prop({ type: Date, required: true })
  passwordUpdatedAt: Date;

  @Prop({ type: Date, required: true })
  passwordExpiresAt: Date;

  @Prop({ type: String, default: null })
  resetTokenHash?: string | null;

  @Prop({ type: Date, default: null })
  resetTokenExpiresAt?: Date | null;
}

export type PasswordDocument = HydratedDocument<Password>;
export const PasswordSchema = SchemaFactory.createForClass(Password);
