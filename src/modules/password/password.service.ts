import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import argon2 from 'argon2';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  private minLength: number = 8;
  private maxLength: number = 128;
  private argonMemory: number = 4096;
  private argonIterations: number = 2;
  private argonParallelism: number = 1;

  constructor(private readonly config: ConfigService) {
    this.minLength = this.config.get<number>('PASSWORD_MIN_LENGTH');
    this.maxLength = this.config.get<number>('PASSWORD_MAX_LENGTH');
    this.argonMemory = this.config.get<number>('ARGON_MEMORY');
    this.argonIterations = this.config.get<number>('ARGON_ITERATIONS');
    this.argonParallelism = this.config.get<number>('ARGON_PARALLELISM');
  }

  async hash(plain: string): Promise<string> {
    this.logger.debug('Hashing successful');

    return await argon2.hash(plain, {
      type: argon2.argon2id,
      memoryCost: this.argonMemory,
      timeCost: this.argonIterations,
      parallelism: this.argonParallelism,
    });
  }

  async verify(hash: string, plain: string): Promise<boolean> {
    try {
      this.logger.debug('Verifying successful');
      return await argon2.verify(hash, plain);
    } catch (error) {
      this.logger.debug('Hash verification failed', error.message);
      return false;
    }
  }

  validateStrength(plain: string): void {
    if (!plain || typeof plain !== 'string' || plain.length === 0) {
      this.logger.warn('Password must be a non-empty string');
      throw new BadRequestException(['Password must be a non-empty string']);
    }

    if (plain.length < this.minLength) {
      this.logger.warn('Password too short');
      throw new BadRequestException([
        `Password must be at least ${this.minLength} characters long`,
      ]);
    }

    if (plain.length > this.maxLength) {
      this.logger.warn('Password too long');
      throw new BadRequestException([
        `Password must be at most ${this.maxLength} characters long`,
      ]);
    }
    this.logger.debug('Password strength validated');
  }
}
