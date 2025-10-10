export const minutesToMilliseconds = (minutes: number): number => {
  return minutes * 60 * 1000;
};

export const hoursToMilliseconds = (hours: number): number => {
  return hours * 60 * 60 * 1000;
};

export const daysToMilliseconds = (days: number): number => {
  return days * 24 * 60 * 60 * 1000;
};

export const weeksToMilliseconds = (weeks: number): number => {
  return weeks * 7 * 24 * 60 * 60 * 1000;
};

export const monthsToMilliseconds = (months: number): number => {
  return months * 30 * 24 * 60 * 60 * 1000;
};
