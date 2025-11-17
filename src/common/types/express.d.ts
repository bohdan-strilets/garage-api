/* eslint-disable @typescript-eslint/no-empty-object-type */

import { AuthUser } from '@app/modules/auth/types';

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}
