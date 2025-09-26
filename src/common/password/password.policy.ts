import { normalizedString } from '../utils/normalized-string.util';

export const rulesRgx: Record<string, RegExp> = {
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBER: /\d/,
  SPECIAL: /[!@#$%^&*(),.?":{}|<>]/,
};

const commonWeakPasswords: string[] = [
  '12345678',
  '123456789',
  '11111111',
  'iloveyou',
  'password',
  'baseball',
  'football',
  'letmein',
  'sunshine',
  'superman',
  'trustno1',
  'welcome1',
  'admin123',
  'dragon123',
  'monkey123',
];

export const weakPasswordsSet = new Set(commonWeakPasswords.map(normalizedString));
