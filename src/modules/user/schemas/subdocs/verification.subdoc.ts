import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false })
export class Verification {
  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isPhoneVerified: boolean;

  @Prop({ type: String, trim: true, default: null })
  emailVerifyTokenHash?: string | null;

  @Prop({ type: Date, default: null })
  emailVerifyExpiresAt?: Date | null;

  @Prop({ type: String, trim: true, default: null })
  phoneVerifyTokenHash?: string | null;

  @Prop({ type: Date, default: null })
  phoneVerifyExpiresAt?: Date | null;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
