import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

import {
  DEFAULT_CURRENCY,
  DEFAULT_DATE_FORMAT,
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
} from '../constants/regional.constants';
import { CurrencyCode } from '../enums/currency-code.enum';
import { UiLanguage } from '../enums/ui-language.enum';

import { UserProfile, UserProfileSchema } from './subdocs/profile.schema';
import { UserSettings, UserSettingsSchema } from './subdocs/settings.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({ type: String, default: null, trim: true })
  phone?: string | null;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ type: Date, default: null, index: true })
  emailVerifiedAt?: Date | null;

  @Prop({ type: Date, default: null })
  phoneVerifiedAt?: Date | null;

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date | null;

  @Prop({ type: Date, default: null })
  lastPasswordChangeAt?: Date | null;

  @Prop({ type: UserProfileSchema, default: () => ({}) })
  profile: UserProfile;

  @Prop({ type: UserSettingsSchema, default: () => ({}) })
  settings: UserSettings;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Car',
    default: null,
    index: true,
  })
  defaultCarId?: Types.ObjectId | null;

  @Prop({ type: String, enum: UiLanguage, default: UiLanguage.ENG })
  uiLanguage: UiLanguage;

  @Prop({ type: String, default: DEFAULT_LOCALE })
  locale: string;

  @Prop({ type: String, default: DEFAULT_TIMEZONE })
  timezone: string;

  @Prop({ type: String, enum: CurrencyCode, default: DEFAULT_CURRENCY })
  currency: CurrencyCode;

  @Prop({ type: String, default: DEFAULT_DATE_FORMAT })
  dateFormat: string;

  @Prop({ type: Date, default: null, index: true })
  deletedAt?: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
