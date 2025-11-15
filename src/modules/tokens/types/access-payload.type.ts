export type AccessPayload = {
  sub: string;
  jti: string;
  iss: string;
  aud: string;
  iat?: number;
  exp?: number;
  role?: string;
};
