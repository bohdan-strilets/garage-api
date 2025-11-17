import { SignedToken } from '@app/modules/tokens/types';
import { UserSelf } from '@app/modules/user/types';

export type AuthInternalResult = {
  user: UserSelf;
  accessToken: string;
  refreshToken: SignedToken;
};

export type AuthResponse = {
  user: UserSelf;
  accessToken: string;
};
