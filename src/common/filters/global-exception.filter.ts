import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HTTP_ERROR_NAMES } from '../constants/http-error-names.constant';
import { ErrorResponse } from '../types/error-response.type';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const path = req.originalUrl || req.url;
    const method = req.method;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const stack = exception.stack;

      let message: string | string[] = HTTP_ERROR_NAMES[status] || 'Error';

      if (payload && typeof payload === 'string') {
        message = payload;
      }
      if (payload && Array.isArray(payload)) {
        message = payload;
      }
      if (payload && typeof payload === 'object' && 'message' in payload) {
        message = payload.message as string | string[];
      }

      const errorName =
        payload &&
        typeof payload === 'object' &&
        'error' in payload &&
        typeof payload.error === 'string'
          ? payload.error
          : HTTP_ERROR_NAMES[status] || 'Error';

      const dto: ErrorResponse = {
        statusCode: status,
        method,
        message: status >= 500 ? 'Internal server error' : message,
        error: errorName,
        timestamp: new Date().toISOString(),
        path,
      };

      res.status(status).json(dto);

      if (status >= 400 && status < 500) {
        this.logger.warn(`${status} ${method} ${path}`);
      }
      if (status >= 500) {
        this.logger.error(`${status} ${method} ${path}`, stack);
      }
    } else {
      const dto: ErrorResponse = {
        statusCode: 500,
        method,
        message: 'Internal server error',
        error: HTTP_ERROR_NAMES[500],
        timestamp: new Date().toISOString(),
        path,
      };

      res.status(500).json(dto);
    }
  }
}
