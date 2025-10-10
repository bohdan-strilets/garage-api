import { randomBytes } from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

import { getNow } from '@common/now-provider/get-now';

@Injectable()
export class CryptoService {
  private passwordOptions: argon.Options = {};
  private tokenOptions: argon.Options = {};

  private now = getNow();

  constructor(private readonly configService: ConfigService) {
    const memoryCost = Number(this.configService.get<number>('HASH_MEMORY_COST', 65536));
    const timeCost = Number(this.configService.get<number>('HASH_TIME_COST', 3));
    const parallelism = Number(this.configService.get<number>('HASH_PARALLELISM', 2));

    this.passwordOptions = {
      type: argon.argon2id,
      memoryCost: memoryCost,
      timeCost: timeCost,
      parallelism: parallelism,
    };

    this.tokenOptions = {
      ...this.passwordOptions,
      timeCost: 1,
      memoryCost: 16384,
    };
  }

  async hashPassword(password: string): Promise<string> {
    return await argon.hash(password, this.passwordOptions);
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
      return await argon.verify(hash, password);
    } catch {
      return false;
    }
  }

  async hashToken(token: string): Promise<string> {
    return await argon.hash(token, this.tokenOptions);
  }

  async verifyToken(hash: string, token: string): Promise<boolean> {
    try {
      return await argon.verify(hash, token);
    } catch {
      return false;
    }
  }

  needsPasswordRehash(hash: string): boolean {
    return argon.needsRehash(hash, this.passwordOptions);
  }

  needsTokenRehash(hash: string): boolean {
    return argon.needsRehash(hash, this.tokenOptions);
  }

  generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }
}
