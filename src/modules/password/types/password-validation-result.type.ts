import { PasswordErrorCode } from '../enums';

export type PasswordValidationResult = {
  isValid: boolean;
  errors: PasswordErrorCode[];
};
