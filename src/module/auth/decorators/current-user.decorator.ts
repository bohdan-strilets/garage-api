import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthUser } from '../types/auth-user.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    const req = context.switchToHttp().getRequest();
    return req.user as AuthUser;
  },
);
