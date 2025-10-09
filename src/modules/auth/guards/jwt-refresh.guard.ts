import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err: unknown, user: any, _info: unknown, context: ExecutionContext) {
    if (err || !user.payload || !user.session) {
      throw new UnauthorizedException('Unauthorized');
    }

    const req = context.switchToHttp().getRequest();

    req.session = user.session;
    req.user = user.payload;

    return user.payload;
  }
}
