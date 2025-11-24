export const buildFullName = (firstName?: string, lastName?: string): string => {
  return `${firstName ?? ''} ${lastName ?? ''}`.trim();
};
