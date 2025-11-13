import { Types } from 'mongoose';

import { Device } from './device.type';

export type CreateSessionInput = {
  userId: Types.ObjectId;
  familyId: string;
  jti: string;
  refreshTokenHash: string;
  fingerprint?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  device?: Device;
  lastUsedAt: Date;
  expiresAt: Date;
};
