import { BadRequestException } from '@nestjs/common';

import type { Request } from 'express';
import { MongoServerError } from 'mongodb';

import { ErrorMessage } from './error-message.constants';
import type { RequestMeta } from './types/request-meta.type';

export const isValidationError = (error: unknown): boolean => {
  if (!(error instanceof BadRequestException)) {
    return false;
  }

  const response = error.getResponse();

  if (typeof response === 'object' && response !== null && 'message' in response && response.message instanceof Array) {
    return true;
  }

  return false;
};

export const isDuplicateKeyError = (error: unknown): boolean => {
  if (error instanceof MongoServerError) {
    return error.code === 11000;
  }

  return false;
};

export const mapHttpStatusToMessage = (status: number): string => {
  return ErrorMessage[status] ?? 'Error';
};

export const buildTimestamp = (): string => {
  return new Date().toISOString();
};

export const pickRequestMeta = (req: Request): RequestMeta => {
  return {
    method: req.method,
    path: req.originalUrl,
  };
};
