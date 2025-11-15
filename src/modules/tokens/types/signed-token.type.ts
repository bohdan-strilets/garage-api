import { TokenKind } from '../enums';

export interface SignedToken {
  kind: TokenKind;
  token: string;
  jti: string;
  iat: number;
  exp: number;
}
