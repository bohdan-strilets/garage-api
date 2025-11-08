import { HttpException } from '@nestjs/common';

import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';

export const normalizeExceptionMessage = (exception: unknown): string[] => {
  if (exception instanceof HttpException) {
    const messages: string | object | string[] = exception.getResponse();

    if (Array.isArray(messages)) {
      return messages.map(String);
    }

    if (typeof messages === 'string') {
      return [messages];
    }

    if (
      messages &&
      messages instanceof Object &&
      'message' in messages &&
      Array.isArray(messages.message)
    ) {
      return messages.message.map(String);
    }

    if (
      messages &&
      messages instanceof Object &&
      'message' in messages &&
      typeof messages.message === 'string'
    ) {
      return [messages.message];
    }

    return ['Unexpected http error'];
  }

  if (exception instanceof mongoose.Error.CastError) {
    return [exception.message];
  }

  if (exception instanceof mongoose.Error.ValidationError) {
    return [exception.message];
  }

  if (exception instanceof MongoServerError && exception.code === 11000) {
    return ['Duplicate key error'];
  }

  if (exception instanceof Error) {
    return [exception.message];
  }

  return ['Internal server error'];
};
