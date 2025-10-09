import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokensType } from '@modules/token/enums/tokens-type.enum';
import { Payload } from '@modules/token/types/payload.type';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
      issuer: configService.get<string>('JWT_ISSUER'),
      audience: configService.get<string>('JWT_AUDIENCE'),
      passReqToCallback: false,
    });
  }

  async validate(payload: Payload): Promise<Payload> {
    if (payload.type !== TokensType.ACCESS) {
      throw new UnauthorizedException('Invalid token type');
    }

    return payload;
  }
}
