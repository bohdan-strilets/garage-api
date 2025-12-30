import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ErrorCodes } from '@app/common/errors/error-codes';

export const userAlreadyExists = () => {
  throw new ConflictException({
    code: ErrorCodes.USER_EXISTS,
  });
};

export const passwordUpdateFailed = () => {
  throw new BadRequestException({
    code: ErrorCodes.PASSWORD_UPDATE_FAILED,
  });
};

export const invalidCurrentPassword = () => {
  throw new UnauthorizedException({
    code: ErrorCodes.INVALID_CURRENT_PASSWORD,
  });
};

export const passwordSameAsCurrent = () => {
  throw new BadRequestException({
    code: ErrorCodes.PASSWORD_SAME_AS_CURRENT,
  });
};

export const emailAlreadyVerified = () => {
  throw new ConflictException({
    code: ErrorCodes.EMAIL_ALREADY_VERIFIED,
  });
};

export const emailVerificationResendTooSoon = () => {
  throw new BadRequestException({ code: ErrorCodes.EMAIL_VERIFICATION_RESEND_TOO_SOON });
};

export const userNotFound = () => {
  throw new NotFoundException({
    code: ErrorCodes.USER_NOT_FOUND,
  });
};

export const passwordResetTokenInvalid = () => {
  throw new BadRequestException({
    code: ErrorCodes.PASSWORD_RESET_TOKEN_INVALID,
  });
};

export const emailAlreadyInUse = () => {
  throw new ConflictException({
    code: ErrorCodes.EMAIL_ALREADY_IN_USE,
  });
};

export const phoneAlreadyInUse = () => {
  throw new ConflictException({
    code: ErrorCodes.PHONE_ALREADY_IN_USE,
  });
};
