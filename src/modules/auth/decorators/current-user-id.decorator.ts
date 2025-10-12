import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthUser } from '../types/auth-user.type';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const req = context.switchToHttp().getRequest();
    return (req.user as AuthUser).sub;
  },
);
