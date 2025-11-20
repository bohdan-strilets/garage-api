import { SetMetadata } from '@nestjs/common';

export const SKIP_SUCCESS_RESPONSE_KEY = 'skipSuccessResponse';

export const SkipSuccessResponse = (): ReturnType<typeof SetMetadata> =>
  SetMetadata(SKIP_SUCCESS_RESPONSE_KEY, true);
