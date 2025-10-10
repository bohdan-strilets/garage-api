import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { getNow } from '@common/now-provider/get-now';
import { daysToMilliseconds } from '@common/now-provider/time-transformer';

import { UserProjections } from './enums/user-projections.enum';
import { userIdOnlyProjection } from './projections/user-id-only.projection';
import { userPublicProjection } from './projections/user-public.projection';
import { userSafeProjection } from './projections/user-safe.projection';
import { userSecurityProjection } from './projections/user-security.projections';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserInput } from './types/create-user-input.type';

@Injectable()
export class UserRepository {
  private readonly lifetimeDays: number;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    this.lifetimeDays = Number(this.configService.get<number>('PASSWORD_EXPIRATION_DAYS'));
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizeObjectId(id: string | Types.ObjectId): Types.ObjectId {
    if (typeof id === 'string') {
      return new Types.ObjectId(id.trim());
    }

    return id;
  }

  private getProjection(accessLevel: UserProjections): Record<string, number> {
    let projection = {};

    switch (accessLevel) {
      case UserProjections.SAFE:
        projection = userSafeProjection;
        break;
      case UserProjections.PUBLIC:
        projection = userPublicProjection;
        break;
      case UserProjections.SECURITY:
        projection = userSecurityProjection;
        break;

      case UserProjections.ID_ONLY:
        projection = userIdOnlyProjection;
    }

    return projection;
  }

  async findByEmail(
    email: string,
    accessLevel: UserProjections = UserProjections.SAFE,
  ): Promise<User | null> {
    const normalizedEmail = this.normalizeEmail(email);
    const filter = { email: normalizedEmail };
    const projection = this.getProjection(accessLevel);

    if (!normalizedEmail || normalizedEmail === '') {
      return null;
    }

    return await this.userModel.findOne(filter).select(projection).lean();
  }

  async findById(
    userId: string,
    accessLevel: UserProjections = UserProjections.SAFE,
  ): Promise<User | null> {
    const normalizedId = this.normalizeObjectId(userId);
    const projection = this.getProjection(accessLevel);

    return await this.userModel.findById(normalizedId).select(projection).lean();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const normalizedEmail = this.normalizeEmail(email);
    const filter = { email: normalizedEmail };

    if (!normalizedEmail || normalizedEmail === '') {
      return false;
    }

    const exists = await this.userModel.exists(filter).exec();
    return exists !== null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const normalizedEmail = this.normalizeEmail(input.email);
    const now = getNow();
    const passwordLifetimeDays = daysToMilliseconds(this.lifetimeDays);

    const payload = {
      email: normalizedEmail,
      profile: {
        firstName: input.firstName,
        lastName: input.lastName,
      },
      security: {
        password: {
          hashedPassword: input.hashedPassword,
          passwordUpdatedAt: now,
          passwordExpiresAt: new Date(now.getTime() + passwordLifetimeDays),
        },
      },
    };

    return await this.userModel.create(payload);
  }
}
