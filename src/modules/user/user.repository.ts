import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

import {
  getNow,
  getNowTimestamp,
  minutesToMs,
  normalizeEmail,
  normalizePhone,
  objectIdToString,
} from '@app/common/utils';
import { AuthLockoutConfig, authLockoutConfig } from '@app/config/env/name-space';

import { userSoftDeleteProjection } from './projections';
import { User, UserDocument } from './schemas';
import { CreateUserInput, UserSoftDelete } from './types';

@Injectable()
export class UserRepository {
  private activeById = (userId: string) => ({ _id: userId, isDeleted: false }) as const;
  private activeByEmail = (email: string) => ({ email, isDeleted: false }) as const;
  private activeByPhone = (phone: string) => ({ phone, isDeleted: false }) as const;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(authLockoutConfig.KEY) private readonly lockout: AuthLockoutConfig,
  ) {}

  async create(input: CreateUserInput): Promise<UserDocument> {
    const { email, passwordHash, firstName, lastName } = input;
    const normalizedEmail = normalizeEmail(email);
    const now = getNow();

    const payload = {
      email: normalizedEmail,
      security: {
        password: {
          hash: passwordHash,
          changedAt: now,
        },
      },
      profile: {
        firstName: firstName,
        lastName: lastName,
      },
    };

    return await this.userModel.create(payload);
  }

  async findById(userId: string, projection: ProjectionType<User>): Promise<User | null> {
    const id = objectIdToString(userId);
    const filter: FilterQuery<UserDocument> = this.activeById(id);

    return await this.userModel.findOne(filter).select(projection).lean().exec();
  }

  async findByEmail(email: string, projection: ProjectionType<User>): Promise<User | null> {
    const normalizedEmail = normalizeEmail(email);
    const filter: FilterQuery<UserDocument> = this.activeByEmail(normalizedEmail);

    return await this.userModel.findOne(filter).select(projection).lean().exec();
  }

  async updateById(userId: string, update: UpdateQuery<User>): Promise<User | null> {
    const id = objectIdToString(userId);
    const filter: FilterQuery<UserDocument> = this.activeById(id);
    const options: QueryOptions<UserDocument> = { new: true };

    return await this.userModel.findOneAndUpdate(filter, update, options).lean().exec();
  }

  async softDeleteById(userId: string): Promise<UserSoftDelete | null> {
    const now = getNow();
    const id = objectIdToString(userId);

    const filter: FilterQuery<UserDocument> = this.activeById(id);
    const options: QueryOptions<UserDocument> = { new: true };
    const update: UpdateQuery<User> = {
      $set: { isDeleted: true, deletedAt: now },
    };

    return await this.userModel
      .findOneAndUpdate(filter, update, options)
      .select(userSoftDeleteProjection)
      .lean()
      .exec();
  }

  async existsActiveByEmail(email: string): Promise<boolean> {
    const normalizedEmail = normalizeEmail(email);
    const filter: FilterQuery<UserDocument> = this.activeByEmail(normalizedEmail);

    const user = await this.userModel.exists(filter);
    return !!user;
  }

  async existsActiveByPhone(phone: string): Promise<boolean> {
    const normalizedPhone = normalizePhone(phone);
    const filter: FilterQuery<UserDocument> = this.activeByPhone(normalizedPhone);

    const user = await this.userModel.exists(filter);
    return !!user;
  }

  async incrementFailedLogin(userId: string): Promise<boolean> {
    const now = getNow();
    const id = objectIdToString(userId);

    const filter: FilterQuery<UserDocument> = this.activeById(id);
    const update: UpdateQuery<User> = {
      $inc: { 'security.failedLoginAttempts': 1 },
      $set: { 'security.lastFailedAt': now },
    };

    const result = await this.userModel.updateOne(filter, update).exec();
    return result.modifiedCount > 0;
  }

  async lockAccount(userId: string, minutes: number): Promise<boolean> {
    const timestamp = getNowTimestamp();
    const lockedUntilAt = new Date(timestamp + minutesToMs(minutes));
    const id = objectIdToString(userId);

    const filter: FilterQuery<UserDocument> = this.activeById(id);
    const update: UpdateQuery<User> = {
      $set: { 'security.lockedUntilAt': lockedUntilAt },
    };

    const result = await this.userModel.updateOne(filter, update).exec();
    return result.modifiedCount > 0;
  }

  async resetFailures(userId: string): Promise<boolean> {
    const id = objectIdToString(userId);
    const filter: FilterQuery<UserDocument> = this.activeById(id);
    const update: UpdateQuery<User> = {
      $set: {
        'security.failedLoginAttempts': 0,
        'security.lastFailedAt': null,
        'security.lockedUntil': null,
      },
    };

    const result = await this.userModel.updateOne(filter, update).exec();
    return result.modifiedCount > 0;
  }

  async isLockedById(userId: string): Promise<boolean> {
    const now = new Date();
    const id = objectIdToString(userId);

    const filter: FilterQuery<UserDocument> = {
      ...this.activeById(id),
      'security.lockedUntil': { $gte: now },
    };

    const exists = await this.userModel.exists(filter);
    return !!exists;
  }

  async bumpFailuresAndLockIfNeeded(userId: string): Promise<boolean> {
    const now = getNow();
    const timestamp = getNowTimestamp();
    const id = objectIdToString(userId);

    const lockoutMinutes = this.lockout.lockoutMinutes;
    const maxAttempts = this.lockout.maxFailedAttempts;
    const lockedUntilAt = new Date(timestamp + minutesToMs(lockoutMinutes));

    const filter: FilterQuery<UserDocument> = {
      _id: id,
      isDeleted: false,
      'security.failedLoginAttempts': { $gte: maxAttempts - 1 },
    };

    const update: UpdateQuery<User> = {
      $inc: { 'security.failedLoginAttempts': 1 },
      $set: { 'security.lastFailedAt': now, 'security.lockedUntilAt': lockedUntilAt },
    };

    const result = await this.userModel.updateOne(filter, update).exec();
    return result.modifiedCount > 0;
  }
}
