import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  createCookie(response: Response, name: string, dataForCookie: string) {
    return response.cookie(name, dataForCookie, { sameSite: 'none', secure: true });
  }
}
