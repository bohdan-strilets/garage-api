import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenType } from './enums/token-type.enum';
import { AccessPayload, AccessPayloadInput } from './types/access-payload.type';
import { RefreshPayload, RefreshPayloadInput } from './types/refresh-payload.type';
import { TokenResult } from './types/token-result.type';

@Injectable()
export class TokensAdapter {
  private readonly jwtAccessSecret: string;
  private readonly jwtAccessTtlSeconds: number;
  private readonly jwtRefreshSecret: string;
  private readonly jwtRefreshTtlSeconds: number;
  private readonly jwtIssuer: string;
  private readonly jwtAudience: string;
  private readonly clockTolerance: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtAccessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    this.jwtAccessTtlSeconds = this.configService.get<number>('JWT_ACCESS_TTL_SEC');
    this.jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    this.jwtRefreshTtlSeconds = this.configService.get<number>('JWT_REFRESH_TTL_SEC');
    this.jwtIssuer = this.configService.get<string>('JWT_ISSUER');
    this.jwtAudience = this.configService.get<string>('JWT_AUDIENCE');
    this.clockTolerance = this.configService.get<number>('JWT_CLOCK_TOLERANCE_SEC');
  }

  async signAccess(input: AccessPayloadInput): Promise<TokenResult> {
    const payload: AccessPayload = { ...input, tokenType: TokenType.ACCESS };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.jwtAccessSecret,
      expiresIn: this.jwtAccessTtlSeconds,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
    });

    const decoded = this.jwtService.decode<{ exp: number }>(token);
    const exp = decoded?.exp ?? 0;

    return { token, exp };
  }

  async signRefresh(input: RefreshPayloadInput): Promise<TokenResult> {
    const payload: RefreshPayload = { ...input, tokenType: TokenType.REFRESH };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.jwtRefreshSecret,
      expiresIn: this.jwtRefreshTtlSeconds,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
    });

    const decoded = this.jwtService.decode<{ exp: number }>(token);
    const exp = decoded?.exp ?? 0;

    return { token, exp };
  }

  async verifyAccess(token: string): Promise<AccessPayload> {
    const payload = await this.jwtService.verifyAsync<AccessPayload>(token, {
      secret: this.jwtAccessSecret,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
      clockTolerance: this.clockTolerance,
    });

    if (payload.tokenType !== TokenType.ACCESS) {
      throw new Error('Invalid token type');
    }

    return payload;
  }

  async verifyRefresh(token: string): Promise<RefreshPayload> {
    const payload = await this.jwtService.verifyAsync<RefreshPayload>(token, {
      secret: this.jwtRefreshSecret,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
      clockTolerance: this.clockTolerance,
    });

    if (payload.tokenType !== TokenType.REFRESH) {
      throw new Error('Invalid token type');
    }

    return payload;
  }
}
