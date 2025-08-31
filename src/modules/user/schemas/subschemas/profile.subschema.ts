import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender } from '../../enums/gender.enum';

@Schema({ timestamps: false, versionKey: false, _id: false })
export class Profile {
  @Prop({ type: String, default: null, maxLength: 120 })
  nickname?: string | null;

  @Prop({ type: String, default: null, maxLength: 2048 })
  avatarUrl?: string | null;

  @Prop({ type: String, default: null, maxLength: 2048 })
  coverUrl?: string | null;

  @Prop({ type: String, enum: Gender, default: Gender.OTHER })
  gender?: Gender;

  @Prop({ type: Date, default: null })
  dateOfBirth?: Date | null;
}

export type ProfileDocument = HydratedDocument<Profile>;
export const ProfileSchema = SchemaFactory.createForClass(Profile);
