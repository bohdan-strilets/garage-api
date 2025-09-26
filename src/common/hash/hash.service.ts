import { randomBytes } from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as argon2 from 'argon2';

import { VerifyResult } from './types/verify-result.type';

@Injectable()
export class HashService {
  private readonly options: argon2.Options;
  private readonly pepper: string | null;

  constructor(private readonly configservice: ConfigService) {
    const hashTime = this.configservice.get<number>('HASH_TIME');
    const hashMemory = this.configservice.get<number>('HASH_MEMORY');
    const hashParallelism = this.configservice.get<number>('HASH_PARALLELISM');
    const hashHashLen = this.configservice.get<number>('HASH_HASHLEN');

    this.pepper = this.configservice.get<string>('HASH_PEPPER');
    this.options = {
      type: argon2.argon2id,
      timeCost: hashTime,
      memoryCost: hashMemory,
      parallelism: hashParallelism,
      hashLength: hashHashLen,
    };
  }

  getParams(): argon2.Options {
    return { ...this.options };
  }

  async hash(plain: string): Promise<string> {
    const toHash = this.pepper ? plain + this.pepper : plain;
    return await argon2.hash(toHash, this.options);
  }

  needsRehash(hash: string): boolean {
    return argon2.needsRehash(hash, this.options);
  }

  async verify(plain: string, hash: string): Promise<VerifyResult> {
    const toVerify = this.pepper ? plain + this.pepper : plain;

    const verified = await argon2.verify(hash, toVerify);
    const needsRehash = this.needsRehash(hash);

    return { verified, needsRehash };
  }

  generateToken(size = 32): string {
    return randomBytes(size).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
