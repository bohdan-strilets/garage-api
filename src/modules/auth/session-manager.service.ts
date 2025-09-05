import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Types } from 'mongoose';
import { PasswordService } from '../password/password.service';
import { CookieService } from '../token/cookie.service';
import { CreateSessionDto } from '../token/dto/create-session.dto';
import { SessionRepository } from '../token/session.repository';
import { TokenService } from '../token/token.service';
import { AccessPayload } from '../token/types/access-payload.type';
import { RefreshPayload } from '../token/types/refresh-payload.type';

@Injectable()
export class SessionManagerService {
  private readonly logger = new Logger(SessionManagerService.name);
  private readonly refreshTokenTtl: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
    private readonly sessionRepository: SessionRepository,
    private readonly cookieService: CookieService,
  ) {
    this.refreshTokenTtl = this.configService.get<number>('JWT_REFRESH_TTL');
  }

  async startSession(
    userId: Types.ObjectId,
    userAgent: string,
    ip: string,
    res: Response,
  ): Promise<string> {
    const jti = this.tokenService.generateJti();
    const family = this.tokenService.generateJti();

    const accessPayload: AccessPayload = { sub: userId.toString() };
    const refreshPayload: RefreshPayload = {
      sub: userId.toString(),
      jti,
      family,
    };

    const accessToken = await this.tokenService.signAccessToken(accessPayload);
    const refreshToken =
      await this.tokenService.signRefreshToken(refreshPayload);

    const now = Date.now();
    const expiresAt = new Date(now + this.refreshTokenTtl * 1000);
    const refreshHash = await this.passwordService.hash(refreshToken);

    const sessionPayload: CreateSessionDto = {
      userId: userId.toString(),
      jti,
      family,
      refreshHash,
      expiresAt,
      userAgent,
      ip,
    };

    const session = await this.sessionRepository.create(sessionPayload);

    if (session) {
      this.logger.debug(`New session created: ${session._id}`);
      this.cookieService.setRefresh(res, refreshToken);
    }

    return accessToken;
  }

  async rotateSession(
    incomingRefresh: string,
    userAgent: string,
    ip: string,
    res: Response,
  ): Promise<string> {
    const payload = await this.tokenService.verifyRefreshToken(incomingRefresh);
    const session = await this.sessionRepository.findActiveByJti(payload.jti);

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshHash = await this.passwordService.verify(
      session.refreshHash,
      incomingRefresh,
    );

    if (!refreshHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newJti = this.tokenService.generateJti();

    const accessPayload: AccessPayload = { sub: payload.sub };
    const refreshPayload: RefreshPayload = {
      sub: payload.sub,
      jti: newJti,
      family: payload.family,
    };

    const accessToken = await this.tokenService.signAccessToken(accessPayload);
    const refreshToken =
      await this.tokenService.signRefreshToken(refreshPayload);

    await this.sessionRepository.markRotated(payload.jti, newJti);

    const newRefreshHash = await this.passwordService.hash(refreshToken);
    const now = Date.now();
    const expiresAt = new Date(now + this.refreshTokenTtl * 1000);

    const sessionPayload: CreateSessionDto = {
      userId: payload.sub,
      jti: newJti,
      family: payload.family,
      userAgent,
      ip,
      refreshHash: newRefreshHash,
      expiresAt,
    };

    const newSession = await this.sessionRepository.create(sessionPayload);

    if (newSession) {
      this.logger.debug(`New session created: ${newSession._id}`);
      this.cookieService.setRefresh(res, refreshToken);
    }

    await this.sessionRepository.touchLastUsed(newJti);

    return accessToken;
  }
}
