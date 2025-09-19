import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { toObjectId } from '@/common/mongoose/utils/to-objectid.util';

import { CreateSessionDto } from './dto/create-session.dto';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class SessionRepository {
  constructor(@InjectModel(Session.name) private readonly sessionModel: Model<Session>) {}

  async create(dto: CreateSessionDto): Promise<SessionDocument> {
    const payload = { ...dto, userId: toObjectId(dto.userId) };
    return await this.sessionModel.create(payload);
  }

  async findById(id: string): Promise<SessionDocument | null> {
    const sessionId = toObjectId(id);

    const session = await this.sessionModel.findById(sessionId).exec();
    return session ? session : null;
  }

  async findOneByHash(refreshTokenHash: string): Promise<SessionDocument | null> {
    const filter = { refreshTokenHash };

    const session = await this.sessionModel.findOne(filter).exec();
    return session ? session : null;
  }

  async findActiveByUser(userId: string): Promise<SessionDocument[]> {
    const filter = { userId: toObjectId(userId), isActive: true };

    const sessions = await this.sessionModel.find(filter).sort({ createdAt: -1 }).exec();
    return sessions;
  }

  async markUsed(id: string, when: Date = new Date()): Promise<boolean> {
    const filter = { _id: toObjectId(id) };
    const update = { $set: { lastUsedAt: when } };

    const session = await this.sessionModel.updateOne(filter, update).exec();
    return session.modifiedCount > 0;
  }

  async revokeById(id: string): Promise<boolean> {
    const filter = { _id: toObjectId(id), isActive: true };
    const update = { $set: { isActive: false, revokedAt: new Date() } };
    const options = { new: true };

    const session = await this.sessionModel.findOneAndUpdate(filter, update, options).exec();

    return session ? true : false;
  }

  async revokeAllByUser(userId: string): Promise<boolean> {
    const filter = { userId: toObjectId(userId), isActive: true };
    const update = { $set: { isActive: false, revokedAt: new Date() } };

    const session = await this.sessionModel.updateMany(filter, update).exec();
    return session.modifiedCount > 0;
  }

  async deleteById(id: string): Promise<boolean> {
    const sessionId = toObjectId(id);
    const session = await this.sessionModel.deleteOne({ _id: sessionId }).exec();

    return session.deletedCount > 0;
  }

  async countActiveByUser(userId: string): Promise<number> {
    const filter = { userId: toObjectId(userId), isActive: true };
    return await this.sessionModel.countDocuments(filter).exec();
  }
}
