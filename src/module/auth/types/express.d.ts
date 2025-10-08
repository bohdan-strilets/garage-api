import { SessionDocument } from 'src/module/sessions/schemas/session.schema';
import { Payload } from 'src/module/token/types/payload.type';

declare global {
  namespace Express {
    interface Request {
      user?: Payload;
      session?: SessionDocument;
    }
  }
}

export {};
