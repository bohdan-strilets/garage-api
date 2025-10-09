import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: unknown, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
