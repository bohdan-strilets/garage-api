import { SessionDocument } from '@modules/sessions/schemas/session.schema';
import { Payload } from '@modules/token/types/payload.type';

export type RefreshValidationResult = {
  payload: Payload;
  session: SessionDocument;
};
