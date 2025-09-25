import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

import { Consents, ConsentsSchema } from './subdocs/consents.subdocs';
import { Preferences, PreferencesSchema } from './subdocs/preferences/preferences.subdocs';
import { Profile, ProfileSchema } from './subdocs/profile/profile.subdocs';
import { Security, SecuritySchema } from './subdocs/security/security.subdocs';

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role?: UserRole;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status?: UserStatus;

  @Prop({ type: ProfileSchema })
  profile?: Profile;

  @Prop({ type: PreferencesSchema })
  preferences?: Preferences;

  @Prop({ type: SecuritySchema })
  security?: Security;

  @Prop({ type: ConsentsSchema })
  consents?: Consents;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'security.loginGuard.lockUntil': 1 });
UserSchema.index({ status: 1, deletedAt: 1 });
