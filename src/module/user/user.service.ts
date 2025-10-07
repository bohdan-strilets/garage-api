import { Injectable, NotFoundException } from '@nestjs/common';

import { UserProjections } from './enums/user-projections.enum';
import { User } from './schemas/user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getByIdSafe(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId, UserProjections.SAFE);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getPublicProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId, UserProjections.PUBLIC);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getByEmailSafe(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email, UserProjections.SAFE);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getByEmailForAuth(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email, UserProjections.SECURITY);

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
}
