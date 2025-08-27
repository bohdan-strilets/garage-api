export type ErrorResponse = {
  statusCode: number;
  method: string;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
};
