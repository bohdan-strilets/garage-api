import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserRole } from '../user/enums/user-role.enum';
import { TokensType } from './enums/tokens-type.enum';
import { Payload } from './types/payload.type';
import { TokenPair } from './types/token-pair.type';

@Injectable()
export class TokenService {
  private jwtIssuer: string;
  private jwtAudience: string;
  private jwtAccessSecret: string;
  private jwtAccessExpires: string;
  private jwtRefreshSecret: string;
  private jwtRefreshExpires: string;
  private jwtTolerance: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtIssuer = this.configService.get<string>('JWT_ISSUER');
    this.jwtAudience = this.configService.get<string>('JWT_AUDIENCE');
    this.jwtAccessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    this.jwtAccessExpires = this.configService.get<string>('JWT_ACCESS_EXPIRES');
    this.jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    this.jwtRefreshExpires = this.configService.get<string>('JWT_REFRESH_EXPIRES');
    this.jwtTolerance = parseInt(this.configService.get<string>('JWT_TOLERANCE'));
  }

  async issuePair(userId: string, sessionId: string, userRole: UserRole): Promise<TokenPair> {
    const accessPayload: Payload = {
      sub: userId,
      sid: sessionId,
      type: TokensType.ACCESS,
      userRole,
    };
    const refreshPayload: Payload = {
      sub: userId,
      sid: sessionId,
      type: TokensType.REFRESH,
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      algorithm: 'HS256',
      expiresIn: this.jwtAccessExpires,
      secret: this.jwtAccessSecret,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
    });

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      algorithm: 'HS256',
      expiresIn: this.jwtRefreshExpires,
      secret: this.jwtRefreshSecret,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
    });

    return { accessToken, refreshToken };
  }

  async verifyAccess(token: string): Promise<Payload> {
    const payload = await this.jwtService.verifyAsync<Payload>(token, {
      algorithms: ['HS256'],
      secret: this.jwtAccessSecret,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
      clockTolerance: this.jwtTolerance,
    });

    if (payload.type !== TokensType.ACCESS) {
      throw new Error('Invalid token type');
    }

    return payload;
  }

  async verifyRefresh(token: string): Promise<Payload> {
    const payload = await this.jwtService.verifyAsync<Payload>(token, {
      algorithms: ['HS256'],
      secret: this.jwtRefreshSecret,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
      clockTolerance: this.jwtTolerance,
    });

    if (payload.type !== TokensType.REFRESH) {
      throw new Error('Invalid token type');
    }

    return payload;
  }
}
