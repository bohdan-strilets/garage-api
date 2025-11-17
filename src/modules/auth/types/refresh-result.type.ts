import { SignedToken } from '@app/modules/tokens/types';

export type RefreshInternalResult = {
  accessToken: string;
  refreshToken: SignedToken;
};

export type RefreshResponse = {
  accessToken: string;
};
