import { Throttle } from '@nestjs/throttler';

export const AuthThrottle = (): MethodDecorator & ClassDecorator => {
  const limit = parseInt(process.env.RATE_AUTH_LIMIT ?? '10', 10);
  const ttl = parseInt(process.env.RATE_AUTH_TTL ?? '300', 10);

  return Throttle({ default: { limit, ttl } });
};
