import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/module/user/enums/user-role.enum';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const userRole: UserRole | undefined = req.user?.role;

    if (!userRole) {
      throw new ForbiddenException('Forbidden');
    }

    if (userRole !== required) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
