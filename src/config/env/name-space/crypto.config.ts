import { ConfigType, registerAs } from '@nestjs/config';

export const cryptoConfig = registerAs('crypto', () => {
  const hmac = {
    secret: process.env.CRYPTO_HMAC_SECRET,
  };

  const argon2 = {
    memory: Number(process.env.CRYPTO_ARGON2_MEMORY),
    iterations: Number(process.env.CRYPTO_ARGON2_ITERATIONS),
    parallelism: Number(process.env.CRYPTO_ARGON2_PARALLELISM),
  };

  const password = {
    pepper: process.env.CRYPTO_PEPPER,
    tokenTtlMinutes: Number(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES),
  };

  return {
    hmac,
    argon2,
    password,
  };
});

export type CryptoConfig = ConfigType<typeof cryptoConfig>;
