import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { getNow } from '@common/now-provider/get-now';
import {
  buildPaginationMeta,
  getSkip,
  getSortBy,
  normalizePaginationParams,
} from '@common/pagination';
import { ListParams, PaginatedResult } from '@common/pagination';

import { SessionStatus } from './enums/session-status.enum';
import { Session, SessionDocument } from './schemas/session.schema';
import { CreateSessionInput } from './types/create-session.input.type';
import { Device } from './types/device.type';

@Injectable()
export class SessionsRepository {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {}

  private getNow = () => getNow();

  private generateFamilyId(): string {
    return uuidv4();
  }

  generateSid(): string {
    return uuidv4();
  }

  async createSession(input: CreateSessionInput): Promise<SessionDocument> {
    const payload: CreateSessionInput = {
      sid: input.sid,
      userId: input.userId,
      refreshTokenHash: input.refreshTokenHash,
      refreshExpiresAt: input.refreshExpiresAt,
      device: input.device,
      familyId: input.familyId ?? this.generateFamilyId(),
    };

    return await this.sessionModel.create(payload);
  }

  async findBySid(sid: string): Promise<SessionDocument | null> {
    const filter = { sid };
    return await this.sessionModel.findOne(filter).exec();
  }

  async findActiveByRefreshHash(refreshTokenHash: string): Promise<SessionDocument | null> {
    const now = this.getNow();
    const filter = {
      refreshTokenHash,
      status: SessionStatus.ACTIVE,
      refreshExpiresAt: { $gt: now },
      revokedAt: null,
    };

    return await this.sessionModel.findOne(filter).exec();
  }

  async replacedBy(sid: string, replacedBy: string): Promise<SessionDocument | null> {
    const now = this.getNow();
    const filter = { sid, status: SessionStatus.ACTIVE, revokedAt: null };
    const payload = { replacedBy, status: SessionStatus.REVOKED, revokedAt: now };
    const options = { new: true };

    return await this.sessionModel.findOneAndUpdate(filter, payload, options).exec();
  }

  async rotate(
    sid: string,
    nextRefreshTokenHash: string,
    nextRefreshExpiresAt: Date,
  ): Promise<SessionDocument | null> {
    const now = this.getNow();
    const session = await this.findBySid(sid);

    if (
      !session ||
      session.status !== SessionStatus.ACTIVE ||
      session.revokedAt ||
      session.refreshExpiresAt <= now
    ) {
      return null;
    }

    const payload: CreateSessionInput = {
      sid: this.generateSid(),
      userId: session.userId.toString(),
      familyId: session.familyId,
      refreshTokenHash: nextRefreshTokenHash,
      refreshExpiresAt: nextRefreshExpiresAt,
      device: session.device,
    };

    const newSession = await this.createSession(payload);
    await this.markLastSeen(newSession.sid, session.device);

    const replaced = await this.replacedBy(sid, newSession.sid);

    if (!replaced) {
      await this.sessionModel.findOneAndDelete({ sid: newSession.sid }).exec();
      return null;
    }

    return newSession;
  }

  async revoke(sid: string): Promise<SessionDocument | null> {
    const now = this.getNow();
    const filter = { sid };
    const payload = { status: SessionStatus.REVOKED, revokedAt: now };
    const options = { new: true };

    return await this.sessionModel.findOneAndUpdate(filter, payload, options).exec();
  }

  async revokeFamily(familyId: string): Promise<number> {
    const now = this.getNow();
    const filter = {
      familyId,
      revokedAt: null,
      status: { $ne: SessionStatus.REVOKED },
    };
    const payload = { status: SessionStatus.REVOKED, revokedAt: now };

    return (await this.sessionModel.updateMany(filter, payload)).modifiedCount;
  }

  async revokeAllForUser(userId: string): Promise<number> {
    const now = this.getNow();
    const filter = {
      userId,
      revokedAt: null,
      status: { $ne: SessionStatus.REVOKED },
    };
    const payload = { status: SessionStatus.REVOKED, revokedAt: now };

    return (await this.sessionModel.updateMany(filter, payload)).modifiedCount;
  }

  async markLastSeen(sid: string, device: Device): Promise<SessionDocument | null> {
    const now = this.getNow();
    const filter = { sid };
    const payload = {
      $set: {
        lastSeenAt: now,
        device: {
          ip: device.ip,
          userAgent: device.userAgent,
          os: device.os,
          browser: device.browser,
        },
      },
    };
    const options = { new: true };

    return await this.sessionModel.findOneAndUpdate(filter, payload, options).exec();
  }

  async listUserSessions(
    userId: string,
    meta: ListParams,
  ): Promise<PaginatedResult<SessionDocument>> {
    const now = this.getNow();

    const { page, limit, sort, order } = normalizePaginationParams(meta);
    const skip = getSkip(page, limit);
    const sortBy = getSortBy(sort, order);

    const filter = {
      userId,
      status: { $in: [SessionStatus.ACTIVE, SessionStatus.REVOKED] },
      refreshExpiresAt: { $gt: now },
    };

    const items = await this.sessionModel.find(filter).sort(sortBy).skip(skip).limit(limit).exec();
    const total = await this.sessionModel.countDocuments(filter).exec();
    const paginationMeta = buildPaginationMeta(total, page, limit);

    return {
      items,
      meta: paginationMeta,
    };
  }

  async findActiveByUserAndDevice(
    userId: string,
    deviceId: string,
  ): Promise<SessionDocument | null> {
    const filter = { user: userId, device: { deviceId }, status: SessionStatus.ACTIVE };

    return await this.sessionModel.findOne(filter).exec();
  }
}
