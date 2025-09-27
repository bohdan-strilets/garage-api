import type { TokenType } from '../enums/token-type.enum';

export type AccessPayloadInput = {
  sub: string;
  sid: string;
  scope: string[];
};

export type AccessPayload = {
  tokenType: TokenType.ACCESS;
  sub: string;
  sid: string;
  scope: string[];
  exp?: number;
};
