import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Gender } from '../../enums/gender.enum';

@Schema({ _id: false, versionKey: false })
export class UserProfile {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ trim: true, default: null })
  nickName?: string | null;

  @Prop({ default: null })
  avatarUrl?: string | null;

  @Prop({ default: null })
  coverUrl?: string | null;

  @Prop({ default: null })
  birthDate?: Date | null;

  @Prop({ enum: Gender, default: Gender.OTHER })
  gender: Gender;
}
export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
