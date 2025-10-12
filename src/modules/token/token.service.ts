import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CryptoService } from '@modules/crypto';

import { getTimestamp } from '@common/now-provider/get-now';
import { daysToMilliseconds, hoursToMilliseconds } from '@common/now-provider/time-transformer';

import { TokensType } from './enums/tokens-type.enum';
import { Payload } from './types/payload.type';
import { TokenPair } from './types/token-pair.type';

import { UserRole } from '../user/enums/user-role.enum';

@Injectable()
export class TokenService {
  private readonly jwtAccessSecret: string;
  private readonly jwtAccessExpires: number;
  private readonly jwtRefreshSecret: string;
  private readonly jwtRefreshExpires: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
  ) {
    this.jwtAccessSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.jwtRefreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    const accessExpires = this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES_HOURS');
    const refreshExpires = this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_DAYS');

    this.jwtAccessExpires = hoursToMilliseconds(parseInt(accessExpires));
    this.jwtRefreshExpires = daysToMilliseconds(parseInt(refreshExpires));
  }

  async issuePair(userId: string, role: UserRole, sessionId: string): Promise<TokenPair> {
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
      expiresIn: this.jwtAccessExpires / 1000,
      secret: this.jwtAccessSecret,
    });

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: this.jwtRefreshExpires / 1000,
      secret: this.jwtRefreshSecret,
    });

    const now = getTimestamp();

    const accessExpiresAt = new Date(now + this.jwtAccessExpires);
    const refreshExpiresAt = new Date(now + this.jwtRefreshExpires);

    return { accessToken, refreshToken, accessExpiresAt, refreshExpiresAt };
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

  async hashRefreshToken(token: string): Promise<string> {
    return this.cryptoService.hashToken(token);
  }

  async verifyHashedRefreshToken(hash: string, token: string): Promise<boolean> {
    return this.cryptoService.verifyToken(hash, token);
  }
}
