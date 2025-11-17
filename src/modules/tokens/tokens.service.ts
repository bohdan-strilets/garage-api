import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokensConfig, tokensConfig } from '@app/config/env/name-space';

import { CryptoService } from '../crypto';

import { TokenKind } from './enums';
import { AccessInput, AccessPayload, RefreshInput, RefreshPayload, SignedToken } from './types';

@Injectable()
export class TokensService {
  private readonly accessJwt: JwtService;
  private readonly refreshJwt: JwtService;

  constructor(
    @Inject(tokensConfig.KEY) private readonly config: TokensConfig,
    private readonly cryptoService: CryptoService,
  ) {
    this.accessJwt = new JwtService({
      secret: this.config.access.secret,
      signOptions: {
        issuer: this.config.issuer,
        audience: this.config.audience,
      },
    });

    this.refreshJwt = new JwtService({
      secret: this.config.refresh.secret,
      signOptions: {
        issuer: this.config.issuer,
        audience: this.config.audience,
      },
    });
  }

  generateJti(): string {
    return this.cryptoService.jti();
  }

  async signAccess(input: AccessInput): Promise<SignedToken> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + this.config.access.ttlSec;

    const payload: AccessPayload = {
      sub: input.userId,
      jti: input.jti,
      iat,
      exp,
      roles: input.roles,
    };

    const token = await this.accessJwt.signAsync(payload, {
      secret: this.config.access.secret,
    });

    return {
      kind: TokenKind.ACCESS,
      token,
      jti: input.jti,
      iat,
      exp,
    };
  }

  async signRefresh(input: RefreshInput): Promise<SignedToken> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + this.config.refresh.ttlSec;

    const payload: RefreshPayload = {
      sub: input.userId,
      jti: input.jti,
      iat,
      exp,
    };

    const token = await this.refreshJwt.signAsync(payload, {
      secret: this.config.refresh.secret,
    });

    return {
      kind: TokenKind.REFRESH,
      token,
      jti: input.jti,
      iat,
      exp,
    };
  }

  hashToken(plain: string): string {
    return this.cryptoService.hmacSign(plain);
  }

  verifyToken(plain: string, hash: string): boolean {
    return this.cryptoService.hmacVerify(plain, hash);
  }

  async verifyAccess(token: string): Promise<AccessPayload> {
    try {
      return this.accessJwt.verifyAsync<AccessPayload>(token, {
        secret: this.config.access.secret,
        issuer: this.config.issuer,
        audience: this.config.audience,
      });
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async verifyRefresh(token: string): Promise<RefreshPayload> {
    try {
      return this.refreshJwt.verifyAsync<RefreshPayload>(token, {
        secret: this.config.refresh.secret,
        issuer: this.config.issuer,
        audience: this.config.audience,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
