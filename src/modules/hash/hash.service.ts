import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  private readonly tokenSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.tokenSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
  }

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id });
  }

  async verifyPassword(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }

  hashToken(token: string): string {
    return crypto.createHmac('sha256', this.tokenSecret).update(token).digest('hex');
  }

  verifyToken(hash: string, token: string): boolean {
    const calc = this.hashToken(token);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(calc));
  }
}
