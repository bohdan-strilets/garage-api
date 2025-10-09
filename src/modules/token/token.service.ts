import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokensType } from './enums/tokens-type.enum';
import { Payload } from './types/payload.type';
import { TokenPair } from './types/token-pair.type';

import { UserRole } from '../user/enums/user-role.enum';

@Injectable()
export class TokenService {
  private readonly jwtAccessSecret: string;
  private readonly jwtAccessExpires: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtRefreshExpires: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtAccessSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.jwtAccessExpires = this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES');
    this.jwtRefreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    this.jwtRefreshExpires = this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES');
  }

  async issuePair(userId: string, sessionId: string, role: UserRole): Promise<TokenPair> {
    const accessPayload: Payload = {
      sub: userId,
      sid: sessionId,
      type: TokensType.ACCESS,
      role,
    };
    const refreshPayload: Payload = {
      sub: userId,
      sid: sessionId,
      type: TokensType.REFRESH,
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      expiresIn: this.jwtAccessExpires,
      secret: this.jwtAccessSecret,
    });

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: this.jwtRefreshExpires,
      secret: this.jwtRefreshSecret,
    });

    return { accessToken, refreshToken };
  }

  async verifyAccess(token: string): Promise<Payload> {
    const payload = await this.jwtService.verifyAsync<Payload>(token, {
      secret: this.jwtAccessSecret,
    });

    if (payload.type !== TokensType.ACCESS) {
      throw new Error('Invalid token type');
    }

    return payload;
  }

  async verifyRefresh(token: string): Promise<Payload> {
    const payload = await this.jwtService.verifyAsync<Payload>(token, {
      secret: this.jwtRefreshSecret,
    });

    if (payload.type !== TokensType.REFRESH) {
      throw new Error('Invalid token type');
    }

    return payload;
  }
}
