import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

import { AuthUser } from '@app/modules/auth/types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser | null => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.user ?? null;
  },
);
