import { Injectable, NotFoundException } from '@nestjs/common';

import { UserProjections } from './enums/user-projections.enum';
import { User } from './schemas/user.schema';
import { CreateUserInput } from './types/create-user-input.type';
import { PublicUser } from './types/public-user.type';
import { SafeUser } from './types/safe-user.type';
import { SecurityUser } from './types/security.type';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getByIdSafe(userId: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(userId, UserProjections.SAFE);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getPublicProfile(userId: string): Promise<PublicUser> {
    const user = await this.userRepository.findById(userId, UserProjections.PUBLIC);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getByEmailSafe(email: string): Promise<SafeUser> {
    const user = await this.userRepository.findByEmail(email, UserProjections.SAFE);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getByEmailForAuth(email: string): Promise<SecurityUser> {
    const user = await this.userRepository.findByEmail(email, UserProjections.SECURITY);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getByIdForAuth(userId: string): Promise<SecurityUser> {
    const user = await this.userRepository.findById(userId, UserProjections.SECURITY);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const exists = await this.userRepository.existsByEmail(email);
    return !exists;
  }

  async assertExistsById(userId: string): Promise<boolean> {
    const exists = await this.userRepository.findById(userId, UserProjections.ID_ONLY);

    if (!exists) {
      throw new NotFoundException('User not found');
    }

    return true;
  }

  async createForAuth(input: CreateUserInput): Promise<User> {
    return await this.userRepository.create(input);
  }

  async verifyEmail(rawToken: string): Promise<boolean> {
    return await this.userRepository.verifyEmail(rawToken);
  }

  async updateResetToken(userId: string, resetToken: string, expiresAt: Date): Promise<void> {
    return await this.userRepository.updateResetToken(userId, resetToken, expiresAt);
  }

  async resetPasswordByToken(
    hashedToken: string,
    newPassword: string,
    expiresAt: Date,
  ): Promise<SecurityUser> {
    const result = await this.userRepository.resetPasswordByToken(
      hashedToken,
      newPassword,
      expiresAt,
    );

    return await this.getByIdForAuth(result._id.toString());
  }
}
