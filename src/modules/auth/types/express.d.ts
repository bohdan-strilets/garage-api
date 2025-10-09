import { SessionDocument } from '@modules/sessions/schemas/session.schema';
import { Payload } from '@modules/token/types/payload.type';

declare global {
  namespace Express {
    interface Request {
      user?: Payload;
      session?: SessionDocument;
    }
  }
}

export {};
