import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { objectIdToString } from '@app/common/utils';
import { TokensConfig, tokensConfig } from '@app/config/env/name-space';
import { AccessPayload } from '@app/modules/tokens/types';
import { UserService } from '@app/modules/user';

import { AuthUser } from '../types';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    @Inject(tokensConfig.KEY) config: TokensConfig,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.access.secret,
      issuer: config.issuer,
      audience: config.audience,
    });
  }

  async validate(payload: AccessPayload): Promise<AuthUser> {
    const { sub } = payload;

    if (!Types.ObjectId.isValid(sub)) {
      throw new UnauthorizedException('Invalid token subject');
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
