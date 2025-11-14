import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';

import argon2 from 'argon2';

import { CryptoConfig, cryptoConfig } from '@app/config/env/name-space';

@Injectable()
export class CryptoService {
  private readonly hmacSecret: string;
  private readonly argon2Memory: number;
  private readonly argon2Iterations: number;
  private readonly argon2Parallelism: number;

  constructor(@Inject(cryptoConfig.KEY) private readonly config: CryptoConfig) {
    this.hmacSecret = this.config.hmac.secret;
    this.argon2Memory = this.config.argon2.memory;
    this.argon2Iterations = this.config.argon2.iterations;
    this.argon2Parallelism = this.config.argon2.parallelism;
  }

  async hashPassword(plain: string): Promise<string> {
    return await argon2.hash(plain, {
      type: argon2.argon2id,
      memoryCost: this.argon2Memory,
      timeCost: this.argon2Iterations,
      parallelism: this.argon2Parallelism,
    });
  }

  async verifyPassword(plain: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  randomToken(length = 32): string {
    return randomBytes(length).toString('base64url');
  }

  jti(): string {
    return randomUUID();
  }

  hmacSign(plain: string): string {
    return createHmac('sha256', this.hmacSecret).update(plain).digest('base64url');
  }

  hmacVerify(plain: string, hash: string): boolean {
    const expected = this.hmacSign(plain);
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(hash ?? '', 'utf8');

    if (a.length !== b.length) {
      try {
        timingSafeEqual(a, Buffer.alloc(a.length, 0));
      } catch {
        return false;
      }
      return false;
    }

    try {
      return timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }
}
