import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Gender } from '../../enums';

import { Address, AddressSchema } from './address.subdoc';
import { DrivingLicense, DrivingLicenseSchema } from './driving-license.subdoc';

@Schema({ _id: false, timestamps: false })
export class Profile {
  @Prop({ type: String, trim: true, required: true })
  firstName: string;

  @Prop({ type: String, trim: true, required: true })
  lastName: string;

  @Prop({ type: String, trim: true, default: null })
  nickname?: string | null;

  @Prop({ type: Date, default: null })
  dateBirth?: Date | null;

  @Prop({ enum: Gender, default: Gender.OTHER })
  gender?: Gender;

  @Prop({ type: String, trim: true })
  avatarId?: string;

  @Prop({ type: String, trim: true })
  coverId?: string;

  @Prop({ type: AddressSchema, default: {} })
  address?: Address;

  @Prop({ type: DrivingLicenseSchema, default: {} })
  drivingLicense?: DrivingLicense;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
