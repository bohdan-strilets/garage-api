import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';

import { Request, Response } from 'express';

import { ErrorCodes } from '@app/common/errors';

import { ExceptionResponse } from './types';
import { mapNonHttpToStatus, normalizeExceptionMessage } from './utils';

@Catch()
export class HttpExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    const isHttp = exception instanceof HttpException;

    const message = normalizeExceptionMessage(exception);
    const status = isHttp ? exception.getStatus() : mapNonHttpToStatus(exception);
    let code = ErrorCodes.INTERNAL_SERVER_ERROR;

    if (isHttp) {
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'code' in exceptionResponse
      ) {
        code = exceptionResponse.code as ErrorCodes;
      }
    }

    this.logger.warn(
      `${request.method} ${request.url} -> ${status} [${code}] :: ${message.join(' | ')}`,
    );

    const result: ExceptionResponse = {
      statusCode: status,
      code,
      message,
    };

    response.status(status).json(result);
    return;
  }
}
