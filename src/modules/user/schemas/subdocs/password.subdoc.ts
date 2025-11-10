import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false })
export class Password {
  @Prop({ type: String, required: true, trim: true, select: false })
  hash: string;

  @Prop({ type: Date, default: null })
  changedAt?: Date | null;

  @Prop({ type: String, default: null, trim: true, select: false })
  tokenHash?: string | null;

  @Prop({ type: Date, default: null })
  tokenExpiresAt?: Date | null;

  @Prop({ type: Date, default: null, select: false })
  tokenLastSentAt?: Date | null;
}

export const PasswordSchema = SchemaFactory.createForClass(Password);
