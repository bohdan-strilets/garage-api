import { ErrorCode } from './error-codes';

export type ErrorResponse = {
  timestamp: string;
  path: string;
  method: string;
  status: number;
  code: ErrorCode | string;
  messages: string[];
};
