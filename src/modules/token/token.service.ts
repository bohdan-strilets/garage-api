import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { AccessPayload } from './types/access-payload.type';
import { RefreshPayload } from './types/refresh-payload.type';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  private readonly jwtAccessSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly refreshTokenExpiry: number;
  private readonly accessTokenExpiry: number;
  private readonly jwtIssuer: string;
  private readonly jwtAudience: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtAccessSecret = this.configService.get('JWT_ACCESS_SECRET');
    this.jwtRefreshSecret = this.configService.get('JWT_REFRESH_SECRET');
    this.refreshTokenExpiry = this.configService.get('JWT_REFRESH_TTL');
    this.accessTokenExpiry = this.configService.get('JWT_ACCESS_TTL');
    this.jwtIssuer = this.configService.get('JWT_ISSUER');
    this.jwtAudience = this.configService.get('JWT_AUDIENCE');
  }

  generateJti(): string {
    return v4();
  }

  async signAccessToken(payload: AccessPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.jwtAccessSecret,
      expiresIn: this.accessTokenExpiry,
      issuer: this.jwtIssuer,
      audience: this.jwtAudience,
    });
  }

  async signRefreshToken(payload: RefreshPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.jwtRefreshSecret,
      expiresIn: this.refreshTokenExpiry,
      issuer: this.jwtIssuer,
      audience: this.jwtAudience,
    });
  }

  async verifyAccessToken(token: string): Promise<AccessPayload> {
    try {
      const validToken = await this.jwtService.verifyAsync<AccessPayload>(
        token,
        {
          secret: this.jwtAccessSecret,
          issuer: this.jwtIssuer,
          audience: this.jwtAudience,
        },
      );

      if (!validToken) {
        this.logger.warn('Invalid access token');
        throw new UnauthorizedException('Invalid access token');
      }

      return validToken;
    } catch (error) {
      this.logger.warn('Error verifying access token', error.message);
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshPayload> {
    try {
      const validToken = await this.jwtService.verifyAsync<RefreshPayload>(
        token,
        {
          secret: this.jwtRefreshSecret,
          issuer: this.jwtIssuer,
          audience: this.jwtAudience,
        },
      );

      if (!validToken) {
        this.logger.warn('Invalid refresh token');
        throw new UnauthorizedException('Invalid refresh token');
      }

      return validToken;
    } catch (error) {
      this.logger.warn('Error verifying refresh token', error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
