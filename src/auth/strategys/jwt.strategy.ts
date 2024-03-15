import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PayloadType } from 'src/tokens/types/payload.type';
import { TokensService } from 'src/tokens/tokens.service';
import { TokensTypeEnum } from 'src/tokens/enums/token-type.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly tokensService: TokensService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
    });
  }

  async validate(payload: PayloadType) {
    const tokenFromDb = await this.tokensService.findTokenFromDb(payload._id);
    const isValidatedToken = this.tokensService.checkToken(
      tokenFromDb.accessToken,
      TokensTypeEnum.ACCESS,
    );

    if (tokenFromDb && isValidatedToken) {
      return {
        _id: payload._id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        isActivated: payload.isActivated,
      };
    }
  }
}
