import { NotFoundException } from '@nestjs/common';

import { ErrorCodes } from '../error-codes';

export const carCareProductNotFound = () => {
  throw new NotFoundException({
    code: ErrorCodes.CAR_CARE_PRODUCT_NOT_FOUND,
  });
};

export const carCareSessionNotFound = () => {
  throw new NotFoundException({
    code: ErrorCodes.CAR_CARE_SESSION_NOT_FOUND,
  });
};
