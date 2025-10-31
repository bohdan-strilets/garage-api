import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET!,
    expiresIn: process.env.JWT_ACCESS_EXPIRES ?? '15m',
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: process.env.JWT_REFRESH_EXPIRES ?? '7d',
  },
}));
