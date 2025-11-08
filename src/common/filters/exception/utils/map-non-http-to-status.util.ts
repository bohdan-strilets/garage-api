import { HttpStatus } from '@nestjs/common';

import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';

export const mapNonHttpToStatus = (exception: unknown): number => {
  if (exception instanceof MongoServerError && exception.code === 11000) {
    return HttpStatus.CONFLICT;
  }

  if (exception instanceof mongoose.Error.CastError) {
    return HttpStatus.BAD_REQUEST;
  }

  if (exception instanceof mongoose.Error.ValidationError) {
    return HttpStatus.BAD_REQUEST;
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
};
