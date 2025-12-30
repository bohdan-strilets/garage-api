import { NotFoundException } from '@nestjs/common';

import { ErrorCodes } from '../error-codes';

export const maintenanceRecordNotFound = () => {
  throw new NotFoundException({
    code: ErrorCodes.MAINTENANCE_RECORD_NOT_FOUND,
  });
};
