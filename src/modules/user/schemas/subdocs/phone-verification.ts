import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false })
export class PhoneVerification {
  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String, trim: true, default: null })
  tokenHash?: string | null;

  @Prop({ type: Date, default: null })
  expiresAt?: Date | null;

  @Prop({ type: Date, default: null })
  sentAt?: Date | null;
}

export const PhoneVerificationSchema = SchemaFactory.createForClass(PhoneVerification);
