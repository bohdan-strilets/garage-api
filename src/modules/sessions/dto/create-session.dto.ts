import { Device } from '../types/device.type';

export type CreateSessionDto = {
  userId: string;
  refreshTokenHash: string;
  refreshExpiresAt: Date;
  device: Device;
  familyId?: string;
};
