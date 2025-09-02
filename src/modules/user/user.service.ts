import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    this.passwordService.validateStrength(dto.password);
    const passwordHash = await this.passwordService.hash(dto.password);

    const payload: CreateUserDto = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: passwordHash,
    };

    try {
      const user = await this.userRepository.create(payload);
      this.logger.debug(`User created: ${user.email}`);
      return await this.userRepository.findByEmail(user.email);
    } catch (error) {
      if (error?.code === 11000 || error?.keyValue?.email) {
        throw new ConflictException(['email already taken']);
      }
      throw error;
    }
  }

  async getByEmailPublic(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) return null;
    return user;
  }

  async getByEmailWithSecret(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email, true);

    if (!user) return null;
    return user;
  }
}
