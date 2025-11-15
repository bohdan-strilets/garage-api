export type RefreshPayload = {
  sub: string;
  jti: string;
  iss: string;
  aud: string;
  iat?: number;
  exp?: number;
};
