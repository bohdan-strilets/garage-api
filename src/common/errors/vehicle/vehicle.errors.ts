import { ConflictException, NotFoundException } from '@nestjs/common';

import { ErrorCodes } from '../error-codes';

export const vehiclePlateAlreadyExists = () => {
  throw new ConflictException({
    code: ErrorCodes.VEHICLE_PLATE_ALREADY_EXISTS,
  });
};

export const vehicleNotFound = () => {
  throw new NotFoundException({
    code: ErrorCodes.VEHICLE_NOT_FOUND,
  });
};
