export const getNow = (): Date => {
  return new Date();
};

export const getNowISOString = (): string => {
  return getNow().toISOString();
};

export const getNowTimestamp = (): number => {
  return getNow().getTime();
};
