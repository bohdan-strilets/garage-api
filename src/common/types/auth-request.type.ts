import { Request } from 'express';
import { PayloadType } from 'src/tokens/types/payload.type';

export interface AuthRequestType<U = PayloadType> extends Request {
  user?: U;
}
