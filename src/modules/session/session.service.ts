import { Injectable } from '@nestjs/common';

import { Types } from 'mongoose';

import { PaginatedResult, PaginationOptions } from '@app/common/pagination';
import { getNow } from '@app/common/utils';

import { CryptoService } from '../crypto';

import { RevokedBy } from './enums';
import { Session } from './schemas';
import { SessionRepository } from './session.repository';
import { CreateSessionInput, RotateInput, RotateResult } from './types';

@Injectable()
export class SessionService {
  constructor(
    private readonly repo: SessionRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  generateFamilyId(): string {
    return this.cryptoService.jti();
  }

  async start(input: CreateSessionInput): Promise<Session> {
    const doc: CreateSessionInput = {
      userId: input.userId,
      familyId: input.familyId,
      jti: input.jti,
      refreshTokenHash: input.refreshTokenHash,
      fingerprint: input.fingerprint,
      userAgent: input.userAgent,
      ip: input.ip,
      device: input.device,
      lastUsedAt: input.lastUsedAt,
      expiresAt: input.expiresAt,
    };

    return this.repo.create(doc);
  }

  async touch(jti: string): Promise<boolean> {
    return this.repo.touchLastUsed(jti);
  }

  async listActive(
    userId: Types.ObjectId,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Session>> {
    return this.repo.findActiveByUser(userId, pagination);
  }

  async rotate(input: RotateInput): Promise<RotateResult> {
    return this.repo.rotate(input);
  }

  async logoutByJti(jti: string, by: RevokedBy = RevokedBy.User): Promise<boolean> {
    return this.repo.revokeJti(jti, by);
  }

  async logoutAll(userId: Types.ObjectId, by: RevokedBy = RevokedBy.User): Promise<number> {
    return this.repo.revokeAllOfUser(userId, by);
  }

  async revokeFamily(familyId: string, by: RevokedBy = RevokedBy.System): Promise<number> {
    return this.repo.revokeFamily(familyId, by);
  }

  async markReuse(familyId: string, when: Date = getNow()): Promise<number> {
    return this.repo.markReuseDetected(familyId, when);
  }

  async getById(id: Types.ObjectId): Promise<Session | null> {
    return this.repo.findById(id);
  }

  async getByJti(jti: string): Promise<Session | null> {
    return this.repo.findByJti(jti);
  }

  async removeById(id: Types.ObjectId): Promise<boolean> {
    return this.repo.deleteById(id);
  }
}
