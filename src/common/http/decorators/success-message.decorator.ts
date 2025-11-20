import { SetMetadata } from '@nestjs/common';

export const SUCCESS_MESSAGE_KEY = 'successMessage';

export const SuccessMessage = (message: string): ReturnType<typeof SetMetadata> =>
  SetMetadata(SUCCESS_MESSAGE_KEY, message);
