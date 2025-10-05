import { Injectable } from '@nestjs/common';

import { lowerCase, number, symbol, upperCase } from './password.rules';
import { VerifyStrength } from './types/verify-strength.type';

@Injectable()
export class PasswordService {
  verifyStrength(password: string): VerifyStrength {
    const errors: string[] = [];
    let score: number = 0;

    if (password === '') {
      errors.push('Password is required');
      score = 0;
    }

    if (password.length < 8 || password.length > 64) {
      errors.push('Password length must be between 8 and 64 characters');
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
}
