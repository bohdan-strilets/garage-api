export type RefreshPayload = {
  sub: string;
  jti: string;
  iat?: number;
  exp?: number;
};
