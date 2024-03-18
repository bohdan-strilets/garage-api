import { Injectable } from '@nestjs/common';
import { Response, Request, CookieOptions } from 'express';

@Injectable()
export class CookieService {
  private readonly options: CookieOptions = { sameSite: 'none', secure: true };

  createCookie(response: Response, name: string, dataForCookie: string): Response {
    return response.cookie(name, dataForCookie, this.options);
  }

  deleteCokie(response: Response, name: string): Response {
    return response.clearCookie(name, this.options);
  }

  getCokie(request: Request, name: string): string | undefined {
    return request.cookies[name];
  }
}
