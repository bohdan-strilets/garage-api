import { Types } from 'mongoose';

import { Currency } from '../enums/currency.enum';
import { Distance } from '../enums/distance.enum';
import { DrivingLicense } from '../enums/driving-license.enum';
import { FuelConsumption } from '../enums/fuel-consumption.enum';
import { Gender } from '../enums/gender.enum';
import { Locale } from '../enums/locale.enum';
import { Theme } from '../enums/theme.enum';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Volume } from '../enums/volume.enum';

export type UserType = {
  _id: Types.ObjectId;
  email: string;
  role?: UserRole;
  status?: UserStatus;
  profile: {
    firstName?: string | null;
    lastName?: string | null;
    birthDate?: Date | null;
    gender?: Gender;
    avatarUri?: string | null;
    coverUri?: string | null;
    phone?: string | null;
    driver?: {
      licenseNumber?: string | null;
      categories?: DrivingLicense[];
      issuedAt?: Date | null;
      expiresAt?: Date | null;
    };
    address?: {
      country?: string | null;
      city?: string | null;
      street?: string | null;
      streetNumber?: string | null;
      postalCode?: string | null;
    };
    defaultVehicleId?: Types.ObjectId | null;
  };
  preferences: {
    locale?: Locale;
    currency?: Currency;
    timezone?: string;
    units?: {
      distance?: Distance;
      fuelConsumption?: FuelConsumption;
      volume?: Volume;
    };
    theme?: Theme;
  };
  notifications: {
    channels?: {
      inApp?: boolean;
      email?: boolean;
      push?: boolean;
    };
    digests?: {
      reminders?: boolean;
      news?: boolean;
      documents?: boolean;
    };
  };
  security: {
    password: {
      hashedPassword: string;
      passwordUpdatedAt: Date;
      passwordExpiresAt: Date;
      resetTokenHash?: string | null;
      resetTokenExpiresAt?: Date | null;
    };
    login: {
      lastLoginAt?: Date | null;
      failedAttempts?: number;
      lockUntil?: Date | null;
    };
    emailVerification: {
      isVerified?: boolean;
      verificationTokenHash?: string | null;
      verificationTokenExpiresAt?: Date | null;
    };
  };
  consents: {
    terms: boolean;
    privacy: boolean;
  };
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
