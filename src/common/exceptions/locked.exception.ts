import { HttpException } from '@nestjs/common';
import { HTTP_STATUS_LOCKED } from '../constants/http-status.constants';

export class LockedException extends HttpException {
  constructor(message: string | string[] = 'Resource is locked') {
    super(message, HTTP_STATUS_LOCKED);
  }
}
