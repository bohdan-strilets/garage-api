import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { Gender } from '@app/user/enums/gender.enum';

import { Address, AddressSchema } from './address.subdocs';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class Profile {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, default: null })
  phone?: string | null;

  @Prop({ type: String, default: null })
  avatarUrl?: string | null;

  @Prop({ type: String, default: null })
  coverUrl?: string | null;

  @Prop({ type: Date, default: null })
  birthday?: Date | null;

  @Prop({ enum: Gender, default: Gender.OTHER })
  gender?: Gender;

  @Prop({ type: AddressSchema })
  address?: Address;
}

export type ProfileDocument = HydratedDocument<Profile>;
export const ProfileSchema = SchemaFactory.createForClass(Profile);
