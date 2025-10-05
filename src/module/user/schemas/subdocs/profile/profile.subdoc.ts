import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';
import { Gender } from '../../../enums/gender.enum';
import { Address, AddressSchema } from './address.subdoc';
import { Driver, DriverSchema } from './driver.subdoc';

@Schema({ _id: false, versionKey: false })
export class Profile {
  @Prop({ type: String, default: null, trim: true })
  firstName?: string | null;

  @Prop({ type: String, default: null, trim: true })
  lastName?: string | null;

  @Prop({ type: Date, default: null })
  birthDate?: Date | null;

  @Prop({ enum: Gender, default: Gender.OTHER })
  gender?: Gender;

  @Prop({ type: String, default: null })
  avatarUri?: string | null;

  @Prop({ type: String, default: null })
  coverUri?: string | null;

  @Prop({ type: String, default: null })
  phone?: string | null;

  @Prop({ type: DriverSchema, default: {} })
  driver?: Driver;

  @Prop({ type: AddressSchema, default: {} })
  address?: Address;

  @Prop({ type: Types.ObjectId, default: null })
  defaultVehicleId?: Types.ObjectId | null;
}

export type ProfileDocument = HydratedDocument<Profile>;
export const ProfileSchema = SchemaFactory.createForClass(Profile);
