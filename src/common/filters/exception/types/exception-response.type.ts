import { ErrorCodes } from '@app/common/errors/error-codes';

export type ExceptionResponse = {
  statusCode: number;
  code: ErrorCodes;
  message?: string[];
  timestamp: string;
  path: string;
};
