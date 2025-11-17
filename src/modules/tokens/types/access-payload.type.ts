export type AccessPayload = {
  sub: string;
  jti: string;
  iat?: number;
  exp?: number;
  roles?: string[];
};
