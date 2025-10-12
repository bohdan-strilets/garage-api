import { SessionDocument } from '@modules/sessions/schemas/session.schema';

import { AuthUser } from './auth-user.type';

export type RefreshValidationResult = {
  user: AuthUser;
  session: SessionDocument;
};
