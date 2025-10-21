import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CryptoService } from '@modules/crypto';

import { daysToMilliseconds, hoursToMilliseconds } from '@common/now-provider/time-transformer';

import { lowerCase, number, symbol, upperCase } from './password.rules';
import { ComputePasswordDates } from './types/compute-password-dates.type';
import { GenerateResetToken } from './types/generate-reset-token.type';
import { VerifyStrength } from './types/verify-strength.type';

@Injectable()
export class PasswordService {
  private readonly passwordLengthMin: number;
  private readonly passwordLengthMax: number;
  private readonly resetTokenExpirationHours: number;
  private readonly lifetimeDays: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
  ) {
    this.passwordLengthMin = Number(this.configService.get<number>('PASSWORD_LENGTH_MIN'));
    this.passwordLengthMax = Number(this.configService.get<number>('PASSWORD_LENGTH_MAX'));
    this.resetTokenExpirationHours = Number(
      this.configService.get<number>('RESET_TOKEN_EXPIRATION_HOURS'),
    );
    this.lifetimeDays = Number(this.configService.get<number>('PASSWORD_EXPIRATION_DAYS'));
  }

  verifyStrength(password: string): VerifyStrength {
    const errors: string[] = [];
    let score: number = 0;

    if (password === '') {
      errors.push('Password is required');
      score = 0;
    }

    if (password.length < this.passwordLengthMin || password.length > this.passwordLengthMax) {
      errors.push(
        `Password length must be between ${this.passwordLengthMin} and ${this.passwordLengthMax} characters`,
      );
    } else {
      score += 1;
    }

    if (!(upperCase.test(password) || lowerCase.test(password))) {
      errors.push('Password must include at least one letter');
    } else {
      score += 1;
    }

    if (!(number.test(password) || symbol.test(password))) {
      errors.push('Password must include at least one number or one special character');
    } else {
      score += 1;
    }

    return {
      ok: errors.length === 0 && score >= 3,
      errors,
      score,
    };
  }

  async hashAndValidate(password: string): Promise<string> {
    const strength = this.verifyStrength(password);

    if (!strength.ok) {
      throw new UnprocessableEntityException(strength.errors);
    }

    return await this.cryptoService.hashPassword(password);
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return await this.cryptoService.verifyPassword(hash, password);
  }

  async generateResetToken(): Promise<GenerateResetToken> {
    const tokenPlain = this.cryptoService.generateResetToken();
    const tokenHash = await this.cryptoService.hashToken(tokenPlain);

    const milliseconds = hoursToMilliseconds(this.resetTokenExpirationHours);
    const expiresAt = new Date(Date.now() + milliseconds);

    return { tokenPlain, tokenHash, expiresAt };
  }

  computePasswordDates(base: Date = new Date()): ComputePasswordDates {
    const updated = base;
    const milliseconds = daysToMilliseconds(this.lifetimeDays);
    const expires = new Date(base.getTime() + milliseconds);

    return { passwordUpdatedAt: updated, passwordExpiresAt: expires };
  }

  isExpired(passwordExpiresAt?: Date | null, now = new Date()): boolean {
    if (!passwordExpiresAt) {
      return false;
    }

    return passwordExpiresAt.getTime() <= now.getTime();
  }

  needsRotation(passwordUpdatedAt?: Date | null, now = new Date()): boolean {
    if (!passwordUpdatedAt) {
      return false;
    }

    const ageMs = now.getTime() - passwordUpdatedAt.getTime();
    const rotationMs = daysToMilliseconds(this.lifetimeDays - 7);

    return ageMs >= rotationMs;
  }
}
