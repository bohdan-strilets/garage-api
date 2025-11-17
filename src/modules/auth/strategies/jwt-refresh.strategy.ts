import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { objectIdToString } from '@app/common/utils';
import { TokensConfig, tokensConfig } from '@app/config/env/name-space';
import { RefreshCookieService } from '@app/modules/tokens';
import { RefreshPayload } from '@app/modules/tokens/types';
import { UserService } from '@app/modules/user';

import { AuthUser } from '../types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(tokensConfig.KEY) config: TokensConfig,
    private readonly refreshCookie: RefreshCookieService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => this.refreshCookie.extractFromRequest(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.refresh.secret,
      issuer: config.issuer,
      audience: config.audience,
      passReqToCallback: false,
    });
  }

  async validate(payload: RefreshPayload): Promise<AuthUser> {
    const { sub, jti } = payload;

    if (!sub || !jti) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    const user = await this.userService.findSelfUserById(sub);

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    const userId = objectIdToString(user._id);

    return {
      sub: userId,
      jti: payload.jti,
      roles: user.roles,
    };
  }
}
