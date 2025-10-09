import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Consents, ConsentsSchema } from './subdocs/consents/consents.subdoc';
import { Notifications, NotificationsSchema } from './subdocs/notifications/notifications.subdoc';
import { Preferences, PreferencesSchema } from './subdocs/preferences/preferences.subdoc';
import { Profile, ProfileSchema } from './subdocs/profile/profile.subdoc';
import { Security, SecuritySchema } from './subdocs/security/security.subdoc';

import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role?: UserRole;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status?: UserStatus;

  @Prop({ type: ProfileSchema, default: {} })
  profile: Profile;

  @Prop({ type: PreferencesSchema, default: {} })
  preferences: Preferences;

  @Prop({ type: NotificationsSchema, default: {} })
  notifications: Notifications;

  @Prop({ type: SecuritySchema, default: {} })
  security: Security;

  @Prop({ type: ConsentsSchema, default: {} })
  consents: Consents;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
