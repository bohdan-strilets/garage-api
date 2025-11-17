import { UAParser } from 'ua-parser-js';

import { DeviceType } from '@app/modules/session/enums';
import { Device } from '@app/modules/session/types';

export const parseDeviceFromUserAgent = (userAgent?: string | null): Device => {
  if (!userAgent) {
    return {
      type: DeviceType.Unknown,
      os: null,
      browser: null,
      model: null,
    };
  }

  const parser = new UAParser(userAgent);
  const osInfo = parser.getOS();
  const browserInfo = parser.getBrowser();
  const deviceInfo = parser.getDevice();

  let type: DeviceType = DeviceType.Unknown;

  switch (deviceInfo.type) {
    case 'mobile':
      type = DeviceType.Mobile;
      break;

    case 'tablet':
      type = DeviceType.Tablet;
      break;

    case 'smarttv':
    case 'console':
    case 'wearable':
    case 'embedded':
      type = DeviceType.Desktop;
      break;

    default:
      type = DeviceType.Desktop;
  }

  const os = osInfo.name ?? null;
  const browser = browserInfo.name ?? null;
  const model = deviceInfo.model ?? null;

  return {
    type,
    os,
    browser,
    model,
  };
};
