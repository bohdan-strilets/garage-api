import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentSession = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const session = req.session;

  if (!session) {
    throw new UnauthorizedException('Session not found or inactive');
  }

  return session;
});
