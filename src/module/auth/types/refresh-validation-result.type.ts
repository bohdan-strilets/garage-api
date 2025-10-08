import { SessionDocument } from 'src/module/sessions/schemas/session.schema';
import { Payload } from 'src/module/token/types/payload.type';

export type RefreshValidationResult = {
  payload: Payload;
  session: SessionDocument;
};
