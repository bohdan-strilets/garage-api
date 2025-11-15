import { Inject, Injectable, Logger } from '@nestjs/common';

import type { CookieOptions, Request, Response } from 'express';

import { CookieConfig, cookieConfig, TokensConfig, tokensConfig } from '@app/config/env/name-space';

import { CookieSpec, SignedToken } from './types';

@Injectable()
export class RefreshCookieService {
  private readonly logger = new Logger(RefreshCookieService.name);
  private readonly refreshCookieName = 'refresh_token';

  constructor(
    @Inject(cookieConfig.KEY) private readonly cookieCfg: CookieConfig,
    @Inject(tokensConfig.KEY) private readonly tokenCfg: TokensConfig,
  ) {}

  private buildCookieOptions(ttlSec: number): CookieOptions {
    const maxAgeMs = ttlSec > 0 ? ttlSec * 1000 : undefined;

    return {
      httpOnly: this.cookieCfg.httpOnly,
      secure: this.cookieCfg.secure,
      sameSite: this.cookieCfg.sameSite,
      domain: this.cookieCfg.domain,
      path: this.cookieCfg.path,
      maxAge: maxAgeMs,
    };
  }

  buildCookies(refresh: SignedToken): CookieSpec[] {
    const cookies: CookieSpec[] = [];
    const options = this.buildCookieOptions(this.tokenCfg.refresh.ttlSec);

    cookies.push({
      name: this.refreshCookieName,
      value: refresh.token,
      options: options,
    });

    return cookies;
  }

  setCookies(refresh: SignedToken, res: Response): void {
    const cookies = this.buildCookies(refresh);

    for (const cookie of cookies) {
      this.logger.debug(`Setting cookie: ${cookie.name}`);
      res.cookie(cookie.name, cookie.value, cookie.options);
    }
  }

  clearCookies(res: Response): void {
    const options = this.buildCookieOptions(0);

    this.logger.debug(`Clearing cookie: ${this.refreshCookieName}`);
    res.clearCookie(this.refreshCookieName, options);
  }

  extractFromRequest(req: Request): string | null {
    if (req.cookies) {
      return req.cookies[this.refreshCookieName];
    }

    return null;
  }
}
