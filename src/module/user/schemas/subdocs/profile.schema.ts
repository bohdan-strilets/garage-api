import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Gender } from '../../enums/gender.enum';

@Schema({ _id: false, versionKey: false })
export class UserProfile {
  @Prop({ type: String, required: true, trim: true })
  firstName: string;

  @Prop({ type: String, required: true, trim: true })
  lastName: string;

  @Prop({ type: String, trim: true, default: null })
  nickName?: string | null;

  @Prop({ type: String, default: null })
  avatarUrl?: string | null;

  @Prop({ type: String, default: null })
  coverUrl?: string | null;

  @Prop({ type: Date, default: null })
  birthDate?: Date | null;

  @Prop({ type: String, enum: Gender, default: Gender.OTHER })
  gender: Gender;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
