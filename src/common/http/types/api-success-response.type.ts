import { ApiMeta } from './api-meta.type';

export type ApiSuccessResponse<Data = unknown> = {
  success: true;
  message: string | null;
  data: Data;
  meta?: ApiMeta;
};
