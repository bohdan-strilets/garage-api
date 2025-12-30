import { NotFoundException } from '@nestjs/common';

import { ErrorCodes } from '../error-codes';

export const imageNotFound = () => {
  throw new NotFoundException({
    code: ErrorCodes.IMAGE_NOT_FOUND,
  });
};

export const ownerImagesNotFound = () => {
  throw new NotFoundException({
    code: ErrorCodes.OWNER_IMAGES_NOT_FOUND,
  });
};

export const ownerImageOfKindNotFound = () => {
  throw new NotFoundException({
    code: ErrorCodes.OWNER_IMAGE_OF_KIND_NOT_FOUND,
  });
};
