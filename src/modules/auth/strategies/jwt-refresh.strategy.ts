import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { SessionsService } from '@modules/sessions';
import { SessionStatus } from '@modules/sessions/enums/session-status.enum';
import { CookieAdapter } from '@modules/token';
import { TokensType } from '@modules/token/enums/tokens-type.enum';
import { TokenService } from '@modules/token/token.service';
import { Payload } from '@modules/token/types/payload.type';

import { getNow } from '@common/now-provider/get-now';

import { AuthUser } from '../types/auth-user.type';
import { RefreshValidationResult } from '../types/refresh-validation-result.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly cookieAdapter: CookieAdapter,
    private readonly sessionsService: SessionsService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: (req: Request) => cookieAdapter.getRefreshCookie(req),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      issuer: configService.getOrThrow<string>('JWT_ISSUER'),
      audience: configService.getOrThrow<string>('JWT_AUDIENCE'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Payload): Promise<RefreshValidationResult> {
    if (payload?.type !== TokensType.REFRESH) {
      throw new UnauthorizedException('Unauthorized');
    }

    const refreshToken = this.cookieAdapter.getRefreshCookie(req);

    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const session = await this.sessionsService.getBySid(payload.sid);
    const now = getNow();

    if (!session || session.refreshExpiresAt <= now || session.status !== SessionStatus.ACTIVE) {
      throw new UnauthorizedException('Unauthorized');
    }

    const authUser: AuthUser = {
      sub: payload.sub,
      sid: payload.sid,
      role: payload.role,
    };

    return { user: authUser, session };
  }
}
