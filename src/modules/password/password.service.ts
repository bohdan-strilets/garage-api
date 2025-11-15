import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { CryptoService } from '../crypto';

import { PasswordPolicyService } from './password-policy.service';
import { PasswordContext, PasswordValidationResult } from './types';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  constructor(
    private readonly policy: PasswordPolicyService,
    private readonly crypto: CryptoService,
  ) {}

  validate(password: string, context?: PasswordContext): PasswordValidationResult {
    return this.policy.validate(password, context);
  }

  async hashIfValid(password: string, context?: PasswordContext): Promise<string> {
    const result = this.policy.validate(password, context);

    if (!result.isValid) {
      this.logger.debug('Invalid password attempt');
      throw new BadRequestException({
        message: 'Password does not meet security requirements',
        codes: result.errors,
      });
    }

    return await this.crypto.hashPassword(password);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return await this.crypto.verifyPassword(password, hash);
  }

  generateRandomPassword(length = 16): string {
    const min = this.policy.minLength;
    const max = this.policy.maxLength;

    let finalLength = length;

    if (finalLength < min) {
      finalLength = min;
    }

    if (finalLength > max) {
      finalLength = max;
    }

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    const charsLength = chars.length;

    let result = '';

    for (let i = 0; i < finalLength; i += 1) {
      const index = Math.floor(Math.random() * charsLength);
      result += chars[index];
    }

    return result;
  }
}
