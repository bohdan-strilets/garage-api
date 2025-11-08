export const parseOrigins = (origins: string): string[] =>
  String(origins ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
