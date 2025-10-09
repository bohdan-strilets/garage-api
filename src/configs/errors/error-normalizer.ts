import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { ErrorResponse } from './error.type';
import {
  getCode,
  getMessages,
  getTimestamp,
  isCastError,
  isDuplicateKeyError,
  isRateLimitedError,
  isUnprocessableEntityError,
  statusToErrorCode,
} from './error.util';
import { ErrorCodes } from './error-codes';

export const normalizeError = (error: unknown, req: Request): ErrorResponse => {
  const timestamp = getTimestamp();
  const path = req.originalUrl || req.url;
  const method = req.method;

  if (error instanceof HttpException) {
    const status = error.getStatus();
    const code = getCode(error);
    const messages = getMessages(error);

    if (isUnprocessableEntityError(status)) {
      return {
        timestamp,
        path,
        method,
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        code: ErrorCodes.VALIDATION_FAILED,
        messages: messages.length > 0 ? messages : ['Validation error'],
      };
    }

    if (isRateLimitedError(status)) {
      return {
        timestamp,
        path,
        method,
        status: HttpStatus.TOO_MANY_REQUESTS,
        code: ErrorCodes.RATE_LIMITED,
        messages: messages.length > 0 ? messages : ['Too many requests'],
      };
    }

    return {
      timestamp,
      path,
      method,
      status,
      code: code || statusToErrorCode(status),
      messages: messages.length > 0 ? messages : ['Unknown error'],
    };
  }

  if (isDuplicateKeyError(error)) {
    return {
      timestamp,
      path,
      method,
      status: HttpStatus.CONFLICT,
      code: ErrorCodes.DUPLICATE_KEY,
      messages: ['Duplicate key error'],
    };
  }

  if (isCastError(error)) {
    return {
      timestamp,
      path,
      method,
      status: HttpStatus.BAD_REQUEST,
      code: ErrorCodes.BAD_ID_FORMAT,
      messages: ['Invalid data format'],
    };
  }

  return {
    timestamp,
    path,
    method,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    code: ErrorCodes.INTERNAL_SERVER_ERROR,
    messages: ['Internal server error'],
  };
};
