import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HashService } from '../hash/hash.service';
import { normalizedString } from '../utils/normalized-string.util';

import { rulesRgx, weakPasswordsSet } from './password.policy';
import { PasswordValidationResult } from './types/password-validation-result.type';
import { ResetTokenPayload } from './types/reset-token-payload.type';

@Injectable()
export class PasswordService {
  private readonly minLength: number;
  private readonly maxLength: number;
  private readonly resetTtlMin: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly hashService: HashService,
  ) {
    this.minLength = this.configService.get<number>('PASSWORD_MIN_LENGTH');
    this.maxLength = this.configService.get<number>('PASSWORD_MAX_LENGTH');
    this.resetTtlMin = this.configService.get<number>('PASSWORD_RESET_TTL_MIN');
  }

  validateStrength(password: string): PasswordValidationResult {
    let score = 0;
    const errors: string[] = [];

    const normalized = normalizedString(password);

    if (password.length < this.minLength) {
      errors.push('Password is too short');
    } else {
      score++;
    }

    if (password.length > this.maxLength) {
      errors.push('Password is too long');
    }

    const hasLetter = rulesRgx.LOWERCASE.test(password) || rulesRgx.UPPERCASE.test(password);
    const hasDigit = rulesRgx.NUMBER.test(password);

    if (!hasLetter) {
      errors.push('Password must contain at least one letter');
    } else {
      score++;
    }

    if (!hasDigit) {
      errors.push('Password must contain at least one digit');
    } else {
      score++;
    }

    const hasSpecial = rulesRgx.SPECIAL.test(password);
    const hasUppercaseAndLowercase = rulesRgx.UPPERCASE.test(password) && rulesRgx.LOWERCASE.test(password);

    if (hasUppercaseAndLowercase || hasSpecial) {
      score++;
    }

    if (weakPasswordsSet.has(normalized)) {
      errors.push('Password is too common or weak');
    }

    return { ok: errors.length === 0, score, errors };
  }

  async hash(password: string): Promise<string> {
    return this.hashService.hash(password);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return (await this.hashService.verify(password, hash)).verified;
  }

  async issueResetToken(): Promise<ResetTokenPayload> {
    const token = this.hashService.generateToken(32);
    const hash = await this.hashService.hash(token);

    const hour = this.resetTtlMin * 60 * 1000;
    const expiresAt = new Date(Date.now() + hour);

    return { token, hash, expiresAt };
  }

  async verifyResetToken(rawToken: string, storedHash: string, expiresAt: Date): Promise<boolean> {
    const now = new Date();

    if (!storedHash) {
      return false;
    }

    if (expiresAt && now > expiresAt) {
      return false;
    }

    return (await this.hashService.verify(rawToken, storedHash)).verified;
  }
}
