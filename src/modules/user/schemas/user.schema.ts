import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { toJSONIdPlugin } from '@/common/mongoose/plugins/tojson-id.plugin.ts';

import { UserRoles } from '../enums/user-roles.enum';

import { Contact, ContactSchema } from './subdocs/contact.schema';
import { Profile, ProfileSchema } from './subdocs/profile.schema';
import { Safety, SafetySchema } from './subdocs/safety.schema';
import { Settings, SettingsSchema } from './subdocs/settings.schema';

@Schema({ timestamps: true, versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  passwordHash: string;

  @Prop({ enum: UserRoles, default: UserRoles.USER })
  role?: UserRoles;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;

  @Prop({ type: ProfileSchema, default: {} })
  profile: Profile;

  @Prop({ type: ContactSchema, default: {} })
  contact: Contact;

  @Prop({ type: SafetySchema, default: {} })
  safety: Safety;

  @Prop({ type: SettingsSchema, default: {} })
  settings: Settings;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Car' }], default: [] })
  cars: Types.ObjectId[];

  updatedAt: Date;

  createdAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(toJSONIdPlugin);
