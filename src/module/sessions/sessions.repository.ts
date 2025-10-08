import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { getNow } from '@common/now-provider/get-now';
import {
  buildPaginationMeta,
  getSkip,
  getSortBy,
  normalizePaginationParams,
} from '@common/pagination';
import { ListParams, PaginatedResult } from '@common/pagination';

import { CreateSessionDto } from './dto/create-session.dto';
import { SessionStatus } from './enums/session-status.enum';
import { Session, SessionDocument } from './schemas/session.schema';
import { Device } from './types/device.type';

@Injectable()
export class SessionsRepository {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {}

  private getNow = () => getNow();

  private generateFamilyId = () => uuidv4();

  private objectIdToString = (id: Types.ObjectId) => id.toString();

  async createSession(dto: CreateSessionDto): Promise<SessionDocument> {
    const payload = {
      user: dto.userId,
      refreshTokenHash: dto.refreshTokenHash,
      refreshExpiresAt: dto.refreshExpiresAt,
      device: dto.device,
      familyId: dto.familyId ?? this.generateFamilyId(),
    };

    return await this.sessionModel.create(payload);
  }

  async findById(sessionId: string): Promise<SessionDocument | null> {
    return await this.sessionModel.findById(sessionId).exec();
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

  async replacedBy(sessionId: string, replacedBy: string): Promise<SessionDocument | null> {
    const now = this.getNow();
    const filter = { _id: sessionId, status: SessionStatus.ACTIVE, revokedAt: null };
    const payload = { replacedBy, status: SessionStatus.REVOKED, revokedAt: now };
    const options = { new: true };

    return await this.sessionModel.findOneAndUpdate(filter, payload, options).exec();
  }

  async rotate(
    sessionId: string,
    nextRefreshTokenHash: string,
    nextRefreshExpiresAt: Date,
  ): Promise<SessionDocument | null> {
    const now = this.getNow();
    const session = await this.findById(sessionId);

    if (
      !session ||
      session.status !== SessionStatus.ACTIVE ||
      session.revokedAt ||
      session.refreshExpiresAt <= now
    ) {
      return null;
    }

    const payload = {
      user: session?.user,
      familyId: session?.familyId,
      refreshTokenHash: nextRefreshTokenHash,
      refreshExpiresAt: nextRefreshExpiresAt,
      device: session?.device,
      lastSeenAt: now,
    };

    const newSession = await this.sessionModel.create(payload);

    const newSessionId = this.objectIdToString(newSession._id);
    const replaced = await this.replacedBy(sessionId, newSessionId);

    if (!replaced) {
      await this.sessionModel.findByIdAndDelete(newSessionId).exec();
      return null;
    }

    return newSession;
  }

  async revoke(sessionId: string): Promise<SessionDocument | null> {
    const now = this.getNow();
    const filter = { _id: sessionId };
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
      user: userId,
      revokedAt: null,
      status: { $ne: SessionStatus.REVOKED },
    };
    const payload = { status: SessionStatus.REVOKED, revokedAt: now };

    return (await this.sessionModel.updateMany(filter, payload)).modifiedCount;
  }

  async markLastSeen(sessionId: string, device: Device): Promise<SessionDocument | null> {
    const now = this.getNow();
    const filter = { _id: sessionId };
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
      user: userId,
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
