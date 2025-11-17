import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    return user?.sub ?? null;
  },
);
