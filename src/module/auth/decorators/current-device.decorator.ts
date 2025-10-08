import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Device } from 'src/module/sessions/types/device.type';
import { UAParser } from 'ua-parser-js';

export const CurrentDevice = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Device => {
    const req = ctx.switchToHttp().getRequest();

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      null;

    const userAgent = (req.headers['user-agent'] as string) || null;

    const deviceId = (req.headers['x-device-id'] as string | undefined) ?? null;

    let os: string | null = null;
    let browser: string | null = null;

    if (userAgent) {
      const parser = new UAParser(userAgent);
      const osInfo = parser.getOS();
      const browserInfo = parser.getBrowser();

      os = osInfo.name ? `${osInfo.name} ${osInfo.version ?? ''}`.trim() : null;
      browser = browserInfo.name ? `${browserInfo.name} ${browserInfo.version ?? ''}`.trim() : null;
    }

    return { deviceId, ip, userAgent, os, browser };
  },
);
