export const resolveEnvFiles = (env = process.env.NODE_ENV) => {
  switch (env) {
    case 'production':
      return ['.env.production', '.env'];

    case 'test':
      return ['.env.test', '.env'];

    default:
      return ['.env.development', '.env'];
  }
};
