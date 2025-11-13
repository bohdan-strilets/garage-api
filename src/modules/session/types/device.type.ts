import { DeviceType } from '../enums';

export type Device = {
  type: DeviceType;
  os?: string | null;
  browser?: string | null;
  model?: string | null;
};
