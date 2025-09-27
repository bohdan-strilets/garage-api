import type { TokenType } from '../enums/token-type.enum';

export type RefreshPayloadInput = {
  sub: string;
  sid: string;
};

export type RefreshPayload = {
  tokenType: TokenType.REFRESH;
  sub: string;
  sid: string;
  exp?: number;
};
