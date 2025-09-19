import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { HashService } from '../hash/hash.service';

import { SessionDocument } from './schemas/session.schema';
import { SessionRepository } from './session.repository';
import { RotateSessionParams } from './types/rotate-session-params.type';
import { StartSessionParams } from './types/start-session-params.type';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly hashService: HashService,
  ) {}

  async startSession(params: StartSessionParams): Promise<SessionDocument> {
    const { userId, plainRefreshToken, userAgent, ip, ttlMs } = params;

    if (!plainRefreshToken) {
      this.logger.warn('Attempted to start session without refresh token');
      throw new BadRequestException('Missing refresh token');
    }

    const now = Date.now();
    const expiresAt = new Date(now + ttlMs);

    const hashToken = this.hashService.hashToken(plainRefreshToken);

    const session = await this.sessionRepository.create({
      userId: userId.toString(),
      refreshTokenHash: hashToken,
      userAgent: userAgent ?? null,
      ip: ip ?? null,
      expiresAt,
    });

    this.logger.debug(`Started session for user ${userId}`);
    return session;
  }

  async verifyRefreshToken(plainToken: string): Promise<SessionDocument> {
    if (!plainToken) {
      this.logger.warn('Attempted to verify session without token');
      throw new BadRequestException('No token');
    }

    const tokenHash = this.hashService.hashToken(plainToken);
    const session = await this.sessionRepository.findOneByHash(tokenHash);
    const now = new Date();

    if (!session) {
      this.logger.warn('Session not found for provided token');
      throw new UnauthorizedException('Session not found');
    }

    if (!session.isActive) {
      this.logger.warn('Attempted to use revoked session');
      throw new UnauthorizedException('Session revoked');
    }

    if (session.expiresAt && session.expiresAt <= now) {
      this.logger.warn('Attempted to use expired session');
      throw new UnauthorizedException('Session expired');
    }

    await this.sessionRepository.markUsed(session.id, now);

    this.logger.debug(`Verified session ${session.id} for user ${session.userId}`);

    return session;
  }

  async rotateSession(params: RotateSessionParams): Promise<SessionDocument> {
    const { oldSessionId, newPlainToken, ttlMs } = params;

    if (!newPlainToken) {
      this.logger.warn('Attempted to rotate session without new token');
      throw new BadRequestException('Missing new token');
    }

    await this.sessionRepository.revokeById(oldSessionId);
    const oldSession = await this.sessionRepository.findById(oldSessionId);

    if (!oldSession) {
      this.logger.warn('Old session not found during rotation');
      throw new NotFoundException('Session not found');
    }

    this.logger.debug(`Rotated session ${oldSessionId} for user ${oldSession.userId}`);

    return this.startSession({
      userId: oldSession.userId,
      plainRefreshToken: newPlainToken,
      ttlMs,
      userAgent: oldSession.userAgent ?? null,
      ip: oldSession.ip ?? null,
    });
  }

  async revokeSession(sessionId: string): Promise<void> {
    this.logger.debug(`Revoking session ${sessionId}`);
    await this.sessionRepository.revokeById(sessionId);
  }

  async revokeAllUserSessions(userId: Types.ObjectId): Promise<void> {
    this.logger.debug(`Revoking all sessions for user ${userId}`);
    await this.sessionRepository.revokeAllByUser(userId.toString());
  }

  async getActiveSessions(userId: Types.ObjectId): Promise<SessionDocument[]> {
    this.logger.debug(`Getting active sessions for user ${userId}`);
    return await this.sessionRepository.findActiveByUser(userId.toString());
  }

  async touch(sessionId: string, when: Date): Promise<boolean> {
    this.logger.debug(`Touching session ${sessionId}`);
    return await this.sessionRepository.markUsed(sessionId, when);
  }
}
