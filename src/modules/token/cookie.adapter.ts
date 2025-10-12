import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Request, Response } from 'express';

import { CookieSameSite } from '@configs/env/enum/cookie-same-site.enum';

export const REFRESH_COOKIE_NAME = 'refresh_token';

@Injectable()
export class CookieAdapter {
  private cookieOptions: CookieOptions = {};

  constructor(private readonly configService: ConfigService) {
    this.cookieOptions = {
      path: this.configService.getOrThrow<string>('COOKIE_PATH'),
      domain: this.configService.getOrThrow<string>('COOKIE_DOMAIN'),
      secure: this.configService.getOrThrow<boolean>('COOKIE_SECURE'),
      sameSite: this.configService.getOrThrow<CookieSameSite>('COOKIE_SAME_SITE'),
      httpOnly: this.configService.getOrThrow<boolean>('COOKIE_HTTPONLY'),
    };
  }

  setRefreshCookie(res: Response, token: string, expires: Date): void {
    const maxAge = expires.getTime() - Date.now();
    res.cookie(REFRESH_COOKIE_NAME, token, { ...this.cookieOptions, maxAge });
  }

  clearRefreshCookie(res: Response): void {
    res.clearCookie(REFRESH_COOKIE_NAME, this.cookieOptions);
  }

  getRefreshCookie(req: Request): string | null {
    return req.cookies?.[REFRESH_COOKIE_NAME] || null;
  }
}
