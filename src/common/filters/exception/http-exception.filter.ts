import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';

import { Request, Response } from 'express';

import { getNowISOString } from '@app/common/utils';

import { ExceptionResponse } from '../types';

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

    this.logger.warn(`${request.method} ${request.url} -> ${status} :: ${message.join(' | ')}`);

    const result: ExceptionResponse = {
      success: false,
      statusCode: status,
      message,
      timestamp: getNowISOString(),
      path: request.url,
    };

    response.status(status).json(result);
    return;
  }
}
