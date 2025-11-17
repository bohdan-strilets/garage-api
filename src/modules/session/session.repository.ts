import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import {
  PaginatedResult,
  paginateFind,
  PaginationOptions,
  sanitizeSort,
} from '@app/common/pagination';
import { getNow, objectIdToString } from '@app/common/utils';

import { RevokedBy } from './enums';
import { Session } from './schemas';
import { CreateSessionInput, RotateInput, RotateResult } from './types';

@Injectable()
export class SessionRepository {
  constructor(@InjectModel(Session.name) private readonly model: Model<Session>) {}

  async findById(sessionId: string): Promise<Session | null> {
    const parsedSessionId = objectIdToString(sessionId);
    return await this.model.findById(parsedSessionId).lean().exec();
  }

  async findByJti(jti: string): Promise<Session | null> {
    return await this.model.findOne({ jti }).lean().exec();
  }

  async findActiveByUser(
    userId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Session>> {
    const now = getNow();
    const parsedUserId = objectIdToString(userId);

    const filter: FilterQuery<Session> = {
      userId: parsedUserId,
      expiresAt: { $gt: now },
      revokedAt: null,
    };

    const { sort, page, limit } = pagination;
    const safeSort = sanitizeSort(sort);

    return paginateFind<Session>(this.model, filter, {
      page: page,
      limit: limit,
      sort: safeSort,
      lean: true,
    });
  }

  async create(input: CreateSessionInput): Promise<Session> {
    return await this.model.create(input);
  }

  async touchLastUsed(jti: string): Promise<boolean> {
    const now = getNow();

    const filter: FilterQuery<Session> = { jti, expiresAt: { $gt: now }, revokedAt: null };
    const update: UpdateQuery<Session> = { lastUsedAt: now };

    const result = await this.model.updateOne(filter, { $set: update }).exec();
    return result.modifiedCount === 1;
  }

  async revokeRotated(oldJti: string, newJti: string, by: RevokedBy): Promise<boolean> {
    const now = getNow();

    const filter: FilterQuery<Session> = {
      jti: oldJti,
      revokedAt: null,
      expiresAt: { $gt: now },
    };

    const update: UpdateQuery<Session> = {
      $set: {
        revokedAt: now,
        revokedBy: by,
        revokeReason: 'rotated',
        replacedByJti: newJti,
      },
    };

    const revoked = await this.model.updateOne(filter, update).exec();
    return revoked.matchedCount === 1;
  }

  async rotate(input: RotateInput): Promise<RotateResult> {
    const now = getNow();

    const revoked = await this.revokeRotated(input.oldJti, input.newSession.jti, input.by);

    if (!revoked) {
      const existed = await this.model.findOne({ jti: input.oldJti });

      if (existed && !existed.reuseDetectedAt) {
        await this.model
          .updateOne(
            { jti: input.oldJti, reuseDetectedAt: null },
            { $set: { reuseDetectedAt: now } },
          )
          .exec();
      }

      return { oldUpdated: false, newCreated: false, newJti: null };
    }

    const sessionInput: CreateSessionInput = {
      userId: input.newSession.userId,
      familyId: input.newSession.familyId,
      jti: input.newSession.jti,
      refreshTokenHash: input.newSession.refreshTokenHash,
      fingerprint: input.newSession.fingerprint,
      userAgent: input.newSession.userAgent,
      ip: input.newSession.ip,
      device: input.newSession.device,
      lastUsedAt: input.newSession.lastUsedAt,
      expiresAt: input.newSession.expiresAt,
    };

    const response = await this.model
      .updateOne({ jti: sessionInput.jti }, { $setOnInsert: sessionInput }, { upsert: true })
      .exec();

    const created = response.upsertedCount === 1;
    return { oldUpdated: true, newCreated: created, newJti: sessionInput.jti };
  }

  async revokeJti(jti: string, by: RevokedBy): Promise<boolean> {
    const now = getNow();

    const filter: FilterQuery<Session> = { jti, revokedAt: null };
    const update: UpdateQuery<Session> = {
      $set: {
        revokedAt: now,
        revokedBy: by,
        revokeReason: 'revoked',
      },
    };

    const res = await this.model.updateOne(filter, update).exec();
    return res.modifiedCount === 1;
  }

  async revokeFamily(familyId: string, by: RevokedBy): Promise<number> {
    const now = getNow();

    const filter: FilterQuery<Session> = { familyId, revokedAt: null };
    const update: UpdateQuery<Session> = {
      $set: {
        revokedAt: now,
        revokedBy: by,
        revokeReason: 'family-revoked',
      },
    };

    const res = await this.model.updateMany(filter, update).exec();
    return res.modifiedCount;
  }

  async revokeAllOfUser(userId: string, by: RevokedBy): Promise<number> {
    const now = getNow();
    const parsedUserId = objectIdToString(userId);

    const filter: FilterQuery<Session> = { userId: parsedUserId, revokedAt: null };
    const update: UpdateQuery<Session> = {
      $set: {
        revokedAt: now,
        revokedBy: by,
        revokeReason: 'logout-all',
      },
    };

    const res = await this.model.updateMany(filter, update).exec();
    return res.modifiedCount;
  }

  async markReuseDetected(familyId: string, when: Date): Promise<number> {
    const filter: FilterQuery<Session> = { familyId, reuseDetectedAt: null };
    const update: UpdateQuery<Session> = { $set: { reuseDetectedAt: when } };

    const res = await this.model.updateMany(filter, update).exec();
    return res.modifiedCount;
  }

  async deleteById(sessionId: string): Promise<boolean> {
    const parsedSessionId = objectIdToString(sessionId);
    const filter: FilterQuery<Session> = { _id: parsedSessionId };

    const res = await this.model.deleteOne(filter).exec();
    return res.deletedCount === 1;
  }
}
