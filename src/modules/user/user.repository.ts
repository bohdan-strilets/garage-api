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
import {
  AuthLockoutConfig,
  authLockoutConfig,
  CryptoConfig,
  cryptoConfig,
} from '@app/config/env/name-space';

import { CryptoService } from '../crypto';

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
    @Inject(cryptoConfig.KEY) private readonly crypto: CryptoConfig,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(input: CreateUserInput): Promise<UserDocument> {
    const {
      email,
      passwordHash,
      firstName,
      lastName,
      verifyEmailTokenHash,
      verifyEmailTokenExpiresAt,
    } = input;

    const normalizedEmail = normalizeEmail(email);
    const now = getNow();

    const payload = {
      email: normalizedEmail,
      verification: {
        isEmailVerified: false,
        emailVerifyTokenHash: verifyEmailTokenHash,
        emailVerifyExpiresAt: verifyEmailTokenExpiresAt,
      },
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

  async findByResetToken(
    resetTokenHash: string,
    projection: ProjectionType<User>,
  ): Promise<User | null> {
    const now = getNow();

    const filter: FilterQuery<UserDocument> = {
      'security.password.tokenHash': resetTokenHash,
      'security.password.tokenExpiresAt': { $gt: now },
      isDeleted: false,
    };

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
        'security.lockedUntilAt': null,
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
      'security.lockedUntilAt': { $gte: now },
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

  async updatePassword(userId: string, passwordHash: string): Promise<boolean> {
    const id = objectIdToString(userId);
    const now = getNow();

    const filter: FilterQuery<UserDocument> = this.activeById(id);
    const update: UpdateQuery<User> = {
      $set: {
        'security.password.hash': passwordHash,
        'security.password.changedAt': now,
      },
    };

    const result = await this.userModel.updateOne(filter, update).exec();
    return result.modifiedCount > 0;
  }

  async clearPasswordResetToken(userId: string): Promise<boolean> {
    const id = objectIdToString(userId);

    const filter: FilterQuery<UserDocument> = this.activeById(id);
    const update: UpdateQuery<User> = {
      $set: {
        'security.password.tokenHash': null,
        'security.password.tokenExpiresAt': null,
        'security.password.tokenLastSentAt': null,
      },
    };

    const result = await this.userModel.updateOne(filter, update).exec();
    return result.modifiedCount > 0;
  }

  async setPasswordResetToken(userId: string, tokenHash: string): Promise<boolean> {
    const id = objectIdToString(userId);
    const now = getNow();
    const nowMs = getNowTimestamp();

    const tokenTtlMs = minutesToMs(this.crypto.password.tokenTtlMinutes);
    const tokenExpiresAt = new Date(nowMs + tokenTtlMs);

    const filter: FilterQuery<UserDocument> = this.activeById(id);
    const update: UpdateQuery<User> = {
      $set: {
        'security.password.tokenHash': tokenHash,
        'security.password.tokenExpiresAt': tokenExpiresAt,
        'security.password.tokenLastSentAt': now,
      },
    };

    const result = await this.userModel.updateOne(filter, update).exec();
    return result.modifiedCount > 0;
  }

  async verifyEmail(plainToken: string): Promise<boolean> {
    const now = getNow();
    const hashedToken = this.cryptoService.hmacSign(plainToken);

    const filter: FilterQuery<UserDocument> = {
      'verification.emailVerifyTokenHash': hashedToken,
      'verification.emailVerifyExpiresAt': { $gt: now },
      isDeleted: false,
    };

    const update: UpdateQuery<User> = {
      $set: {
        'verification.isEmailVerified': true,
        'verification.emailVerifyTokenHash': null,
        'verification.emailVerifyExpiresAt': null,
      },
    };

    const result = await this.userModel.updateOne(filter, update).exec();
    return result.modifiedCount > 0;
  }
}
