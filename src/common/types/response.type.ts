import { ResponseTypeEnum } from '../enums/response-type.enum';

export type ResponseType<D = undefined> = {
  status: ResponseTypeEnum;
  code: number;
  message?: string;
  data?: D;
};
