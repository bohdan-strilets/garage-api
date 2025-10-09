import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

import { normalizeError } from './error-normalizer';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      this.logger.warn('Non-HTTP exception caught, skipping handling in GlobalExceptionFilter');
      return;
    }

    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    const normalizedError = normalizeError(exception, request);

    if (response.headersSent) {
      this.logger.warn(
        `Headers already sent, cannot send error response: PATH: ${normalizedError.path}, METHOD: ${normalizedError.method}`,
      );
      return;
    }

    this.logger.error(
      `STATUS: ${normalizedError.status}; CODE: ${normalizedError.code}; METHOD: ${normalizedError.method}; PATH: ${normalizedError.path}; MESSAGE: ${normalizedError.messages[0]}`,
    );

    response
      .status(normalizedError.status)
      .setHeader('Content-Type', 'application/json; charset=utf-8')
      .json(normalizedError);
  }
}
