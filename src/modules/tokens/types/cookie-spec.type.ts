import { CookieOptions } from 'express';

export type CookieSpec = {
  name: string;
  value: string;
  options: CookieOptions;
};
