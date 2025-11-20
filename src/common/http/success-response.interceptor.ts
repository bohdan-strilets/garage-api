import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SKIP_SUCCESS_RESPONSE_KEY, SUCCESS_MESSAGE_KEY } from './decorators';
import { ApiSuccessResponse } from './types';
import { isApiSuccessResponse, isPaginatedResult } from './utils';

@Injectable()
export class SuccessResponseInterceptor
  implements NestInterceptor<unknown, ApiSuccessResponse<unknown>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<ApiSuccessResponse<unknown>> {
    if (context.getType() !== 'http') {
      return next.handle() as Observable<ApiSuccessResponse<unknown>>;
    }

    const handler = context.getHandler();
    const clazz = context.getClass();

    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_SUCCESS_RESPONSE_KEY, [
      handler,
      clazz,
    ]);

    if (skip) {
      return next.handle() as Observable<ApiSuccessResponse<unknown>>;
    }

    const messageFromMetadata =
      this.reflector.getAllAndOverride<string | null>(SUCCESS_MESSAGE_KEY, [handler, clazz]) ??
      null;

    return next.handle().pipe(
      map((data: unknown): ApiSuccessResponse<unknown> => {
        if (isApiSuccessResponse(data)) {
          return data;
        }

        if (isPaginatedResult(data)) {
          return {
            success: true,
            message: messageFromMetadata,
            data: data.items,
            meta: {
              pagination: data.meta,
            },
          };
        }

        return {
          success: true,
          message: messageFromMetadata,
          data,
        };
      }),
    );
  }
}
