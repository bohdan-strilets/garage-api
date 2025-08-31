import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class CookieService {
  private readonly logger = new Logger(CookieService.name);

  private readonly refreshCookieName: string;
  private readonly cookieDomain: string;
  private readonly cookieSecure: boolean;
  private readonly cookieSameSite: 'lax' | 'strict' | 'none';
  private readonly refreshTokenExpiry: number;

  constructor(private readonly configService: ConfigService) {
    this.cookieDomain = this.configService.get('COOKIE_DOMAIN');
    this.cookieSecure = this.configService.get('COOKIE_SECURE');
    this.cookieSameSite = this.configService.get('COOKIE_SAMESITE');
    this.refreshCookieName = this.configService.get('REFRESH_COOKIE_NAME');
    this.refreshTokenExpiry = this.configService.get('JWT_REFRESH_TTL');
  }

  setRefreshCookie(res: Response, token: string): void {
    res.cookie(this.refreshCookieName, token, {
      httpOnly: true,
      secure: this.cookieSecure,
      sameSite: this.cookieSameSite,
      domain: this.cookieDomain,
      path: '/',
      maxAge: this.refreshTokenExpiry * 1000,
    });
    this.logger.log('Refresh token set in cookie');
  }

  clearRefreshCookie(res: Response): void {
    res.clearCookie(this.refreshCookieName, {
      httpOnly: true,
      secure: this.cookieSecure,
      sameSite: this.cookieSameSite,
      domain: this.cookieDomain,
      path: '/',
    });
    this.logger.log('Refresh token cleared from cookie');
  }

  parseRefreshFromRequest(req: Request): string | null {
    return req.cookies?.[this.refreshCookieName] ?? null;
  }
}
