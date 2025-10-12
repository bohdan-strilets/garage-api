import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { SessionDocument } from '@modules/sessions/schemas/session.schema';

export const CurrentSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionDocument => {
    const req = ctx.switchToHttp().getRequest();
    const session = req.session;

    if (!session) {
      throw new UnauthorizedException('Session not found or inactive');
    }

    return session;
  },
);
