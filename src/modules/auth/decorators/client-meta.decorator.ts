import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

import { Device } from '@app/modules/session/types';

import { ClientMeta } from '../types';
import { parseDeviceFromUserAgent } from '../utils';

export const Client = createParamDecorator((data: unknown, ctx: ExecutionContext): ClientMeta => {
  const request = ctx.switchToHttp().getRequest<Request>();

  const userAgent = request.get('user-agent') ?? null;

  const forwardedFor = request.headers['x-forwarded-for'];
  let ip: string | null = null;

  if (typeof forwardedFor === 'string') {
    ip = forwardedFor.split(',')[0].trim();
  } else if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    ip = forwardedFor[0].split(',')[0].trim();
  } else if (request.ip) {
    ip = request.ip;
  } else if (request.socket?.remoteAddress) {
    ip = request.socket.remoteAddress ?? null;
  }

  const device: Device = parseDeviceFromUserAgent(userAgent);

  const fpHeader = request.headers['x-client-fingerprint'];
  const fingerprint =
    typeof fpHeader === 'string'
      ? fpHeader
      : Array.isArray(fpHeader) && fpHeader.length > 0
        ? fpHeader[0]
        : null;

  return {
    userAgent,
    ip,
    device,
    fingerprint,
  };
});
