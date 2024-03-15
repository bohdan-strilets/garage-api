export const jwtConfig = {
  secret: process.env.ACCESS_TOKEN_KEY,
  signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIME },
};
