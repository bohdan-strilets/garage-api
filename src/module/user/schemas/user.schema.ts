import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

import { UserProfile, UserProfileSchema } from './subdocs/profile.schema';
import { UserSettings, UserSettingsSchema } from './subdocs/settings.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({ default: null, trim: true })
  phone?: string | null;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ default: null, index: true })
  emailVerifiedAt?: Date | null;

  @Prop({ default: null })
  phoneVerifiedAt?: Date | null;

  @Prop({ default: null })
  lastLoginAt?: Date | null;

  @Prop({ default: null })
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

  @Prop({ default: null, index: true })
  deletedAt?: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
