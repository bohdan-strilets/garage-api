import { Types } from 'mongoose';

export type StartSessionParams = {
  userId: Types.ObjectId;
  plainRefreshToken: string;
  ttlMs: number;
  userAgent?: string | null;
  ip?: string | null;
};
