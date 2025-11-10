import { Types } from 'mongoose';

import { UserRole } from '../enums';
import { Profile, Security, Settings, Verification } from '../schemas/subdocs';

export type User = {
  _id: Types.ObjectId;
  email: string;
  phone?: string | null;
  roles: UserRole[];
  profile: Profile;
  settings: Settings;
  verification: Verification;
  security: Security;
  vehicles: Types.ObjectId[];
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
