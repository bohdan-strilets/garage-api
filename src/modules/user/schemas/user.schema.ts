import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { emailRegex, phoneRegex } from '@app/common/regex';

import { UserRole } from '../enums';

import {
  Profile,
  ProfileSchema,
  Security,
  SecuritySchema,
  Settings,
  SettingsSchema,
  Verification,
  VerificationSchema,
} from './subdocs';

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: emailRegex,
    index: true,
  })
  email: string;

  @Prop({ type: String, trim: true, match: phoneRegex, default: null, index: true })
  phone?: string | null;

  @Prop({ type: [String], enum: Object.values(UserRole), default: [UserRole.USER] })
  roles: UserRole[];

  @Prop({ type: ProfileSchema, default: {} })
  profile: Profile;

  @Prop({ type: SettingsSchema, default: {} })
  settings: Settings;

  @Prop({ type: VerificationSchema, default: {} })
  verification: Verification;

  @Prop({ type: SecuritySchema, default: {} })
  security: Security;

  @Prop({ type: [Types.ObjectId], ref: 'Vehicle', default: [] })
  vehicles: Types.ObjectId[];

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1, isDeleted: 1 });
UserSchema.index({ phone: 1, isDeleted: 1 });

UserSchema.index({ 'verification.emailVerifyExpiresAt': 1 }, { expireAfterSeconds: 0 });
UserSchema.index({ 'verification.phoneVerifyExpiresAt': 1 }, { expireAfterSeconds: 0 });
UserSchema.index({ 'security.password.tokenExpiresAt': 1 }, { expireAfterSeconds: 0 });
