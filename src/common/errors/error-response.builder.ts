import { HttpException, HttpStatus } from '@nestjs/common';

import type { Request } from 'express';

import {
  buildTimestamp,
  isDuplicateKeyError,
  isValidationError,
  mapHttpStatusToMessage,
  pickRequestMeta,
} from './error-utils';
import type { ErrorResponseType } from './types/error-response.type';

export const buildErrorResponse = (error: unknown, req: Request): ErrorResponseType => {
  const { method, path } = pickRequestMeta(req);
  const timestamp = buildTimestamp();

  if (isValidationError(error)) {
    return {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: mapHttpStatusToMessage(HttpStatus.UNPROCESSABLE_ENTITY),
      timestamp,
      method,
      path,
    };
  }

  if (error instanceof HttpException) {
    const status = error.getStatus();
    return {
      status,
      message: mapHttpStatusToMessage(status),
      timestamp,
      method,
      path,
    };
  }

  if (isDuplicateKeyError(error)) {
    return {
      status: HttpStatus.CONFLICT,
      message: mapHttpStatusToMessage(HttpStatus.CONFLICT),
      timestamp,
      method,
      path,
    };
  }

  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: mapHttpStatusToMessage(HttpStatus.INTERNAL_SERVER_ERROR),
    timestamp,
    method,
    path,
  };
};
