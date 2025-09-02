import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    id: string,
    withPassword: boolean = false,
  ): Promise<User | null> {
    const filter = { _id: id, 'agreement.deletedAt': null };

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

  async touchLastLogin(userId: string): Promise<boolean> {
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

  async incLoginFailedCount(userId: string): Promise<boolean> {
    const filter = { _id: userId, 'agreement.deletedAt': null };
    const payload = { $inc: { 'security.loginFailedCount': 1 } };

    const result = await this.userModel.updateOne(filter, payload).exec();

    if (result.modifiedCount > 0) {
      this.logger.debug(`Incremented login failed count for user ${userId}`);
      return true;
    }

    this.logger.debug(
      `Failed to increment login failed count for user ${userId}`,
    );

    return false;
  }

  async resetLoginFailedCount(userId: string): Promise<boolean> {
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

  async setLockedUntil(userId: string, until: Date | null): Promise<boolean> {
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

  async softDeleteById(id: string): Promise<boolean> {
    const filter = { _id: id, 'agreement.deletedAt': null };
    const payload = { $set: { 'agreement.deletedAt': new Date() } };

    const result = await this.userModel.updateOne(filter, payload).exec();

    if (result.modifiedCount > 0) {
      this.logger.debug(`Soft deleted user ${id}`);
      return true;
    }

    this.logger.debug(`Failed to soft delete user ${id}`);
    return false;
  }
}
