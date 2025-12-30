import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ErrorCodes } from '../error-codes';

export const odometerValueTooLow = () => {
  throw new BadRequestException({
    code: ErrorCodes.ODOMETER_VALUE_TOO_LOW,
  });
};

export const energySessionNotFound = () => {
  throw new NotFoundException({
    code: ErrorCodes.ENERGY_SESSION_NOT_FOUND,
  });
};
