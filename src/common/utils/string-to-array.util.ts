export const stringToArray = (str = ''): string[] => {
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};
