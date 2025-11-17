import { Device } from '@app/modules/session/types';

export type ClientMeta = {
  userAgent: string | null;
  ip: string | null;
  device: Device;
  fingerprint: string | null;
};
