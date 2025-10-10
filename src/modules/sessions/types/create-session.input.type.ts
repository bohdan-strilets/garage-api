import { Device } from './device.type';

export type CreateSessionInput = {
  sid: string;
  userId: string;
  refreshTokenHash: string;
  refreshExpiresAt: Date;
  device: Device;
  familyId?: string;
};
