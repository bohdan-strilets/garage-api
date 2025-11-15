import { Injectable } from '@nestjs/common';

import { PasswordErrorCode } from './enums';
import { PasswordContext, PasswordValidationResult } from './types';

@Injectable()
export class PasswordPolicyService {
  readonly minLength = 8;
  readonly maxLength = 64;
  readonly requireUppercase = true;
  readonly requireLowercase = true;
  readonly requireDigit = true;
  readonly requireSpecial = true;
  readonly forbidWhitespace = true;

  constructor() {}

  validate(password: string, context?: PasswordContext): PasswordValidationResult {
    const value = typeof password === 'string' ? password : '';
    const errors: PasswordErrorCode[] = [];

    if (value.length < this.minLength) {
      errors.push(PasswordErrorCode.PASSWORD_TOO_SHORT);
    }

    if (value.length > this.maxLength) {
      errors.push(PasswordErrorCode.PASSWORD_TOO_LONG);
    }

    if (this.requireUppercase && !/[A-Z]/.test(value)) {
      errors.push(PasswordErrorCode.PASSWORD_NO_UPPERCASE);
    }

    if (this.requireLowercase && !/[a-z]/.test(value)) {
      errors.push(PasswordErrorCode.PASSWORD_NO_LOWERCASE);
    }

    if (this.requireDigit && !/[0-9]/.test(value)) {
      errors.push(PasswordErrorCode.PASSWORD_NO_DIGIT);
    }

    if (this.requireSpecial && !/[^A-Za-z0-9]/.test(value)) {
      errors.push(PasswordErrorCode.PASSWORD_NO_SPECIAL);
    }

    if (this.forbidWhitespace && /\s/.test(value)) {
      errors.push(PasswordErrorCode.PASSWORD_HAS_WHITESPACE);
    }

    if (context?.email) {
      const email = context.email.toLowerCase();
      const passwordLower = value.toLowerCase();

      const atIndex = email.indexOf('@');
      if (atIndex > 0) {
        const localPart = email.slice(0, atIndex);

        if (localPart.length >= 4 && passwordLower.includes(localPart)) {
          errors.push(PasswordErrorCode.PASSWORD_CONTAINS_EMAIL_PART);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
