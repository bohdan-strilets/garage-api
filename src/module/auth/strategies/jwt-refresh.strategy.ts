import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { CryptoService } from 'src/module/crypto/crypto.service';
import { SessionsService } from 'src/module/sessions';
import { SessionStatus } from 'src/module/sessions/enums/session-status.enum';
import { CookieAdapter } from 'src/module/token';
import { TokensType } from 'src/module/token/enums/tokens-type.enum';
import { Payload } from 'src/module/token/types/payload.type';

import { getNow } from '@common/now-provider/get-now';

import { RefreshValidationResult } from '../types/refresh-validation-result.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly cookieAdapter: CookieAdapter,
    private readonly sessionsService: SessionsService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => cookieAdapter.getRefreshCookie(req),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      issuer: configService.get<string>('JWT_ISSUER'),
      audience: configService.get<string>('JWT_AUDIENCE'),
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

    const session = await this.sessionsService.getById(payload.sid);
    const now = getNow();

    if (!session || session.refreshExpiresAt < now || session.status !== SessionStatus.ACTIVE) {
      throw new UnauthorizedException('Unauthorized');
    }

    const isTokenValid = await this.cryptoService.verifyToken(
      session.refreshTokenHash,
      refreshToken,
    );

    if (!isTokenValid) {
      await this.sessionsService.handleReplayBySession(payload.sid);
      throw new UnauthorizedException('Unauthorized');
    }

    return { payload, session };
  }
}
