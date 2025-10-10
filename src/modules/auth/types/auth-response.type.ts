import { SafeUser } from '@modules/user/types/safe-user.type';

export type AuthResponse = {
  accessToken: string;
  accessExpiresAt: Date;
  user: SafeUser;
};
