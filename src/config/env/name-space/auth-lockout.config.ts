import { ConfigType, registerAs } from '@nestjs/config';

export const authLockoutConfig = registerAs('auth.lockout', () => {
  return {
    maxFailedAttempts: parseInt(process.env.MAX_FAILED_LOGIN_ATTEMPTS || '5', 10),
    lockoutMinutes: parseInt(process.env.LOCK_UNTIL_MINUTES || '15', 10),
  };
});

export type AuthLockoutConfig = ConfigType<typeof authLockoutConfig>;
