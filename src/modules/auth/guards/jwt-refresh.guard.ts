import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AuthUser } from '../types/auth-user.type';
import { RefreshValidationResult } from '../types/refresh-validation-result.type';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  handleRequest<TUser = AuthUser>(
    err: unknown,
    user: any,
    _info: unknown,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const rv = user as RefreshValidationResult;

    if (!rv.user || !rv.session) {
      throw new UnauthorizedException('Unauthorized');
    }

    const req = context.switchToHttp().getRequest<Request>();

    req.session = rv.session;
    req.user = rv.user;

    return rv.user as TUser;
  }
}
