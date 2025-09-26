import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateSessionDto } from './dto/create-session.dto';
import { SessionStatus } from './enums/session-status.enum';
import { Session } from './schemas/session.schema';

const withHashProjection = {};
const publicProjection = { refreshHash: 0, ip: 0 };

@Injectable()
export class SessionsRepository {
  constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) {}

  async create(dto: CreateSessionDto): Promise<Session> {
    return this.sessionModel.create(dto);
  }

  async findById(sessionId: string, withHash: boolean = false): Promise<Session | null> {
    const filter = { _id: sessionId };
    const projection = withHash ? withHashProjection : publicProjection;

    return await this.sessionModel.findOne(filter, projection).exec();
  }

  async findActiveByUser(
    userId: string,
    limit: number = 50,
    offset: number = 0,
    sort: string = '-lastUsedAt',
    now: Date,
  ): Promise<Session[]> {
    const status = SessionStatus.ACTIVE;

    const filter = { userId, status, expiresAt: { $gte: now } };

    return await this.sessionModel.find(filter, publicProjection).sort(sort).skip(offset).limit(limit).exec();
  }

  async updateOnRotate(
    sessionId: string,
    newRefreshHash: string,
    newExpiresAt: Date,
    now: Date,
  ): Promise<Session | null> {
    const status = SessionStatus.ACTIVE;

    const filter = { _id: sessionId, status, expiresAt: { $gte: now } };
    const options = { new: true, projection: publicProjection };

    const update = {
      refreshHash: newRefreshHash,
      lastUsedAt: now,
      expiresAt: newExpiresAt,
    };

    return await this.sessionModel.findOneAndUpdate(filter, update, options).exec();
  }

  async markRevoked(sessionId: string, now: Date): Promise<boolean> {
    const filter = { _id: sessionId, status: SessionStatus.ACTIVE, expiresAt: { $gte: now } };
    const update = { status: SessionStatus.REVOKED, revokedAt: now };

    const result = await this.sessionModel.updateOne(filter, update).exec();
    return !!result.modifiedCount;
  }

  async markRevokedMany(userId: string, now: Date): Promise<number> {
    const filter = { userId, status: SessionStatus.ACTIVE, expiresAt: { $gte: now } };
    const update = { status: SessionStatus.REVOKED, revokedAt: now };

    const result = await this.sessionModel.updateMany(filter, update).exec();
    return result.modifiedCount;
  }

  async markExpiredBatch(now: Date): Promise<number> {
    const filter = { expiresAt: { $lt: now }, status: SessionStatus.ACTIVE };
    const update = { status: SessionStatus.EXPIRED };

    const result = await this.sessionModel.updateMany(filter, update).exec();
    return result.modifiedCount;
  }

  async countActiveByUser(userId: string, now: Date): Promise<number> {
    const filter = { userId, status: SessionStatus.ACTIVE, expiresAt: { $gte: now } };

    return await this.sessionModel.countDocuments(filter).exec();
  }
}
