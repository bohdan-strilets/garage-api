import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Genders } from '../../enums/genders.enum';

@Schema({ timestamps: false, versionKey: false, _id: false })
export class Profile {
  @Prop({ type: String, default: null })
  nickname?: string | null;

  @Prop({ enum: Genders, default: Genders.OTHER })
  gender?: Genders;

  @Prop({ type: Date, default: null })
  dateOfBirth?: Date | null;

  @Prop({ type: String, default: null })
  avatarUrl?: string | null;

  @Prop({ type: String, default: null })
  coverUrl?: string | null;
}

export type ProfileDocument = HydratedDocument<Profile>;
export const ProfileSchema = SchemaFactory.createForClass(Profile);
