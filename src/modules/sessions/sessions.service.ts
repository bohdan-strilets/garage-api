import { Injectable, Logger } from '@nestjs/common';

import { getNow } from '@common/now-provider/get-now';
import { ListParams, PaginatedResult } from '@common/pagination';

import { SessionDocument } from './schemas/session.schema';
import { SessionsRepository } from './sessions.repository';
import { CreateSessionInput } from './types/create-session.input.type';
import { Device } from './types/device.type';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(private readonly sessionsRepository: SessionsRepository) {}

  generateSid(): string {
    return this.sessionsRepository.generateSid();
  }

  async createInitial(input: CreateSessionInput): Promise<SessionDocument> {
    this.logger.debug('Creating initial session');
    return await this.sessionsRepository.createSession(input);
  }

  async rotateBySession(
    sid: string,
    nextRefreshTokenHash: string,
    nextRefreshExpiresAt: Date,
  ): Promise<SessionDocument> {
    const now = getNow();

    if (nextRefreshExpiresAt <= now) {
      this.logger.debug('Invalid refresh token expiration');
      throw new Error('Invalid refresh token expiration');
    }

    const newSession = await this.sessionsRepository.rotate(
      sid,
      nextRefreshTokenHash,
      nextRefreshExpiresAt,
    );

    if (!newSession) {
      this.logger.warn('Failed to rotate session');
      throw new Error('Failed to rotate session');
    }

    this.logger.debug('Session rotated successfully');
    return newSession;
  }

  async revokeBySid(sid: string): Promise<SessionDocument> {
    const revokedSession = await this.sessionsRepository.revoke(sid);

    if (!revokedSession) {
      this.logger.warn('Failed to revoke session');
      throw new Error('Failed to revoke session');
    }

    this.logger.debug('Session revoked successfully');
    return revokedSession;
  }

  async revokeAllForUser(userId: string): Promise<number> {
    this.logger.debug('Revoking all sessions for user');
    return await this.sessionsRepository.revokeAllForUser(userId);
  }

  async revokeFamily(familyId: string): Promise<number> {
    this.logger.debug('Revoking all sessions for family');
    return await this.sessionsRepository.revokeFamily(familyId);
  }

  async handleReplayBySession(sid: string): Promise<void> {
    const session = await this.sessionsRepository.findBySid(sid);

    if (!session) {
      this.logger.debug('Session not found for replay handling');
      return;
    }

    await this.sessionsRepository.revokeFamily(session.familyId);
  }

  async findActiveByRefreshHash(refreshHash: string): Promise<SessionDocument | null> {
    return await this.sessionsRepository.findActiveByRefreshHash(refreshHash);
  }

  async getBySid(sid: string): Promise<SessionDocument | null> {
    return await this.sessionsRepository.findBySid(sid);
  }

  async markActivity(sid: string, device: Device): Promise<void> {
    try {
      this.logger.debug('Marking session activity');
      this.sessionsRepository.markLastSeen(sid, device);
    } catch (error) {
      this.logger.error('Failed to mark session activity', error);
    }
  }

  async listUserSessions(
    userId: string,
    meta: ListParams,
  ): Promise<PaginatedResult<SessionDocument>> {
    return await this.sessionsRepository.listUserSessions(userId, meta);
  }
}
