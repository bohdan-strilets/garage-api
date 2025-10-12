/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { AuthUser } from '@modules/auth/types/auth-user.type';
import type { SessionDocument } from '@modules/sessions/schemas/session.schema';

declare global {
  namespace Express {
    interface User extends AuthUser {}

    interface Request {
      user?: AuthUser;
      session?: SessionDocument;
    }
  }
}

export {};
