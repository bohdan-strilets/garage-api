import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { normalizeEmail } from '../helpers/normalize-email.helper';
import { PUBLIC_PROJECTION, SECRET_PROJECTION } from './constants/projections';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const normalizedEmail = normalizeEmail(dto.email);
    return await this.userModel.create({ ...dto, email: normalizedEmail });
  }

  async findByEmail(
    email: string,
    withPassword: boolean = false,
  ): Promise<User | null> {
    const normalizedEmail = normalizeEmail(email);
    const filter = { email: normalizedEmail, 'agreement.deletedAt': null };

    if (withPassword) {
      return await this.userModel
        .findOne(filter)
        .select(SECRET_PROJECTION)
        .lean();
    }

    return await this.userModel
      .findOne(filter)
      .select(PUBLIC_PROJECTION)
      .lean();
  }

  async findById(
    _id: Types.ObjectId,
    withPassword: boolean = false,
  ): Promise<User | null> {
    const filter = { _id, 'agreement.deletedAt': null };

    if (withPassword) {
      return await this.userModel
        .findOne(filter)
        .select(SECRET_PROJECTION)
        .lean();
    }

    return await this.userModel
      .findOne(filter)
      .select(PUBLIC_PROJECTION)
      .lean();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const normalizedEmail = normalizeEmail(email);
    const filter = { email: normalizedEmail, 'agreement.deletedAt': null };

    return (await this.userModel.countDocuments(filter).lean()) > 0;
  }

  async touchLastLogin(userId: Types.ObjectId): Promise<boolean> {
    const filter = { _id: userId, 'agreement.deletedAt': null };
    const payload = { $set: { 'security.lastLoginAt': new Date() } };
    const options = {
      new: true,
      projection: { 'security.lastLoginAt': 1 },
    };

    const result = await this.userModel
      .findOneAndUpdate(filter, payload, options)
      .exec();

    if (!result) {
      this.logger.debug(`Failed to update last login for user ${userId}`);
      return false;
    }

    this.logger.debug(`Updated last login for user ${userId}`);
    return true;
  }

  async incLoginFailedCount(userId: Types.ObjectId): Promise<number> {
    const filter = { _id: userId, 'agreement.deletedAt': null };
    const payload = { $inc: { 'security.loginFailedCount': 1 } };
    const options = {
      new: true,
      projection: { 'security.loginFailedCount': 1 },
    };

    const result = await this.userModel
      .findOneAndUpdate(filter, payload, options)
      .exec();

    if (!result) {
      this.logger.warn(
        `Failed to increment login failed count for user ${userId}`,
      );

      return 0;
    }

    const count = result?.security?.loginFailedCount ?? 0;
    this.logger.debug(`Incremented login failed count ${count}`);
    return count;
  }

  async resetLoginFailedCount(userId: Types.ObjectId): Promise<boolean> {
    const filter = { _id: userId, 'agreement.deletedAt': null };
    const payload = { $set: { 'security.loginFailedCount': 0 } };

    const result = await this.userModel.updateOne(filter, payload).exec();

    if (result.modifiedCount > 0) {
      this.logger.debug(`Reset login failed count for user ${userId}`);
      return true;
    }

    this.logger.debug(`Failed to reset login failed count for user ${userId}`);
    return false;
  }

  async setLockedUntil(
    userId: Types.ObjectId,
    until: Date | null,
  ): Promise<boolean> {
    const filter = { _id: userId, 'agreement.deletedAt': null };
    const payload = { $set: { 'security.lockedUntil': until } };

    const result = await this.userModel.updateOne(filter, payload).exec();

    if (result.modifiedCount > 0) {
      this.logger.debug(`Set locked until for user ${userId} to ${until}`);
      return true;
    }

    this.logger.debug(`Failed to set locked until for user ${userId}`);
    return false;
  }

  async softDeleteById(_id: Types.ObjectId): Promise<boolean> {
    const filter = { _id, 'agreement.deletedAt': null };
    const payload = { $set: { 'agreement.deletedAt': new Date() } };

    const result = await this.userModel.updateOne(filter, payload).exec();

    if (result.modifiedCount > 0) {
      this.logger.debug(`Soft deleted user ${_id}`);
      return true;
    }

    this.logger.debug(`Failed to soft delete user ${_id}`);
    return false;
  }
}
