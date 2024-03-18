import { HttpException, Injectable } from '@nestjs/common';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { ResponseTypeEnum } from 'src/common/enums/response-type.enum';

@Injectable()
export class ErrorsService {
  showHttpException(HttpStatus: number, ErrorMessages: ErrorMessages) {
    throw new HttpException(
      {
        status: ResponseTypeEnum.ERROR,
        code: HttpStatus,
        message: ErrorMessages,
      },
      HttpStatus,
    );
  }
}
