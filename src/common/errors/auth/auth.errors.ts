import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { ErrorCodes } from '../error-codes';

export const accountLocked = () => {
  throw new UnauthorizedException({
    code: ErrorCodes.ACCOUNT_LOCKED,
  });
};

export const invalidCredentials = () => {
  throw new UnauthorizedException({
    code: ErrorCodes.INVALID_CREDENTIALS,
  });
};

export const sessionInvalid = () => {
  throw new UnauthorizedException({
    code: ErrorCodes.SESSION_INVALID,
  });
};

export const refreshTokenReuseDetected = () => {
  throw new UnauthorizedException({
    code: ErrorCodes.REFRESH_TOKEN_REUSE_DETECTED,
  });
};

export const sessionNotFound = () => {
  throw new NotFoundException({
    code: ErrorCodes.SESSION_NOT_FOUND,
  });
};
