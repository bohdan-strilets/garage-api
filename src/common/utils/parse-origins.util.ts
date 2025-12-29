export const parseOrigins = (origins?: string): string | string[] => {
  if (!origins) {
    return 'http://localhost:5173';
  }

  const parsed = origins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  return parsed.length === 1 ? parsed[0] : parsed;
};
