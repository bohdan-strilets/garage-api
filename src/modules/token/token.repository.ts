import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class TokenRepository {
  private readonly logger = new Logger(TokenRepository.name);

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async create(dto: CreateSessionDto): Promise<SessionDocument> {
    return this.sessionModel.create(dto);
  }

  async findActiveByJti(jti: string): Promise<SessionDocument | null> {
    const now = Date.now();
    const session = await this.sessionModel
      .findOne({ jti, revokedAt: null, expiresAt: { $gt: new Date(now) } })
      .exec();

    if (!session) {
      this.logger.warn(`Active session not found for jti: ${jti}`);
      return null;
    }

    return session;
  }

  async markRotated(jti: string, replaceBy: string): Promise<boolean> {
    if (!replaceBy || replaceBy.trim() === '') {
      this.logger.warn('replaceBy must be provided');
      throw new BadRequestException('replaceBy must be provided');
    }

    if (jti === replaceBy) {
      this.logger.warn('Session cannot replace itself');
      throw new ConflictException('Session cannot replace itself');
    }

    const now = Date.now();
    const params = { jti, revokedAt: null, expiresAt: { $gt: new Date(now) } };
    const payload = { $set: { revokedAt: new Date(now), replaceBy } };
    const options = { new: true };

    const updated = await this.sessionModel.findOneAndUpdate(
      params,
      payload,
      options,
    );

    if (!updated) {
      this.logger.warn(`Session with jti: ${jti} not found`);
      return false;
    }

    this.logger.debug(`Session with jti: ${jti} marked as rotated`);
    return true;
  }

  async revokeByJti(jti: string): Promise<boolean> {
    const now = Date.now();
    const params = { jti, revokedAt: null, expiresAt: { $gt: new Date(now) } };
    const payload = { $set: { revokedAt: new Date(now) } };
    const options = { new: true };

    const updated = await this.sessionModel.findOneAndUpdate(
      params,
      payload,
      options,
    );

    if (!updated) {
      this.logger.warn(`Session with jti: ${jti} not found`);
      return false;
    }

    this.logger.debug(`Session with jti: ${jti} revoked`);
    return true;
  }

  async revokeFamily(family: string): Promise<boolean> {
    const now = Date.now();
    const params = {
      family,
      revokedAt: null,
      expiresAt: { $gt: new Date(now) },
    };
    const payload = { $set: { revokedAt: new Date(now) } };
    const options = { new: true };

    const updated = await this.sessionModel.findOneAndUpdate(
      params,
      payload,
      options,
    );

    if (!updated) {
      this.logger.warn(`Session with family: ${family} not found`);
      return false;
    }

    this.logger.debug(`Session with family: ${family} revoked`);
    return true;
  }

  async touchLastUsed(jti: string): Promise<void> {
    try {
      const now = Date.now();
      const params = {
        jti,
        revokedAt: null,
        expiresAt: { $gt: new Date(now) },
      };
      const payload = { $set: { lastUsedAt: new Date(now) } };
      const options = { new: true };

      await this.sessionModel.findOneAndUpdate(params, payload, options).exec();

      this.logger.debug(`Session with jti: ${jti} lastUsedAt updated`);
    } catch (error) {
      this.logger.error(
        `Failed to update lastUsedAt for session with jti: ${jti}`,
        error.stack,
      );
    }
  }
}
