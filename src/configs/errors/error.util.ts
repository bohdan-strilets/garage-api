import { HttpException, HttpStatus } from '@nestjs/common';
import { MongoServerError } from 'mongodb';

import { ErrorCode } from './error-codes';
import { ErrorCodes, StatusCodeMap } from './error-codes';

export const getTimestamp = (): string => {
  return new Date().toISOString();
};

export const getCode = (error: unknown): string => {
  if (error instanceof HttpException) {
    const payload = error.getResponse?.();

    if (payload && typeof payload === 'object' && 'code' in payload) {
      const raw = (payload as any).code;
      if (typeof raw === 'string' && raw.trim()) {
        return raw.trim();
      }
    }

    return '';
  }

  if (error && typeof error === 'object' && 'code' in error) {
    const raw = (error as any).code;

    if (typeof raw === 'string' && raw.trim()) {
      return raw.trim();
    }
  }

  return '';
};

export const statusToErrorCode = (status: number): ErrorCode => {
  return StatusCodeMap[status] || ErrorCodes.INTERNAL_SERVER_ERROR;
};

export const getMessages = (error: unknown): string[] => {
  if (error instanceof HttpException) {
    const messageResponse = error.getResponse();
    const messages: string[] = [];

    if (messageResponse && typeof messageResponse === 'object' && 'message' in messageResponse) {
      if (messageResponse.message && Array.isArray(messageResponse.message)) {
        messages.push(...messageResponse.message);
      }
      if (messageResponse.message && typeof messageResponse.message === 'string') {
        messages.push(messageResponse.message);
      }
    }
    if (messageResponse && typeof messageResponse === 'string') {
      messages.push(messageResponse);
    }
    if (messageResponse && Array.isArray(messageResponse)) {
      messages.push(...messageResponse);
    }

    const result = messages.map((msg) => msg.toString().trim()).filter((msg) => msg.length > 0);

    return [...new Set(result)];
  }

  return [];
};

export const isUnprocessableEntityError = (status: number): boolean => {
  return status === HttpStatus.UNPROCESSABLE_ENTITY;
};

export const isRateLimitedError = (status: number): boolean => {
  return status === HttpStatus.TOO_MANY_REQUESTS;
};

export const isDuplicateKeyError = (error: unknown): boolean => {
  return error instanceof MongoServerError && error.code === 11000;
};

export const isCastError = (error: unknown): boolean => {
  return (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    typeof error.name === 'string' &&
    error.name === 'CastError'
  );
};
