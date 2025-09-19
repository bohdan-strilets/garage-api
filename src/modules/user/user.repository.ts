import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { toObjectId } from '@/common/mongoose/utils/to-objectid.util';
import { normalizeEmail } from '@/common/utils/normalize-email.util';

import {
  USER_PRIVATE_PROJECTION,
  USER_PUBLIC_PROJECTION,
} from './schemas/projections/user.projections';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findById(
    userId: string,
    isPrivate: boolean = false,
  ): Promise<UserDocument | null> {
    const userObjectId = toObjectId(userId);
    const projection = isPrivate
      ? USER_PRIVATE_PROJECTION
      : USER_PUBLIC_PROJECTION;

    return this.userModel.findById(userObjectId).projection(projection).exec();
  }

  async findByEmail(
    email: string,
    isPrivate: boolean = false,
  ): Promise<UserDocument | null> {
    const normalizedEmail = normalizeEmail(email);
    const projection = isPrivate
      ? USER_PRIVATE_PROJECTION
      : USER_PUBLIC_PROJECTION;

    return this.userModel
      .findOne({ email: normalizedEmail })
      .projection(projection)
      .exec();
  }
}
