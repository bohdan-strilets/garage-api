import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { objectIdToString } from '@app/common/utils';

import { userPublicProjection, userSecurityProjection, userSelfProjection } from './projections';
import { CreateUserInput, UserPublic, UserSecurity, UserSelf, UserSoftDelete } from './types';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(input: CreateUserInput): Promise<UserSelf> {
    const user = await this.userRepository.create(input);
    const id = objectIdToString(user._id);

    return await this.findSelfUserById(id);
  }

  async findSelfUserById(userId: string): Promise<UserSelf> {
    const user: UserSelf = await this.userRepository.findById(userId, userSelfProjection);

    if (!user) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findPublicUserById(userId: string): Promise<UserPublic> {
    const user: UserPublic = await this.userRepository.findById(userId, userPublicProjection);

    if (!user) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findSecurityUserByEmail(email: string): Promise<UserSecurity> {
    const user: UserSecurity = await this.userRepository.findByEmail(email, userSecurityProjection);

    if (!user) {
      this.logger.debug(`User with email ${email} not found`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findSecurityUserById(userId: string): Promise<UserSecurity> {
    const user: UserSecurity = await this.userRepository.findById(userId, userSecurityProjection);

    if (!user) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async softDeleteUserById(userId: string): Promise<boolean> {
    const deleted: UserSoftDelete = await this.userRepository.softDeleteById(userId);

    if (!deleted) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    this.logger.log(`User with ID ${userId} has been soft deleted`);
    return true;
  }

  async existsActiveByEmail(email: string): Promise<boolean> {
    return await this.userRepository.existsActiveByEmail(email);
  }

  async existsActiveByPhone(phone: string): Promise<boolean> {
    return await this.userRepository.existsActiveByPhone(phone);
  }

  async incrementFailedLogin(userId: string): Promise<boolean> {
    return await this.userRepository.incrementFailedLogin(userId);
  }

  async lockAccount(userId: string, minutes: number): Promise<boolean> {
    return await this.userRepository.lockAccount(userId, minutes);
  }

  async resetFailures(userId: string): Promise<boolean> {
    return await this.userRepository.resetFailures(userId);
  }

  async isLockedById(userId: string): Promise<boolean> {
    return await this.userRepository.isLockedById(userId);
  }

  async bumpFailuresAndLockIfNeeded(userId: string): Promise<boolean> {
    return await this.userRepository.bumpFailuresAndLockIfNeeded(userId);
  }
}
