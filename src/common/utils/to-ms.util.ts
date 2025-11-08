const MS = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

export const secondsToMs = (seconds: string | number): number => {
  if (typeof seconds === 'string') {
    const parsed = parseInt(seconds, 10);
    return isNaN(parsed) ? 0 : parsed * MS;
  }

  return seconds * MS;
};

export const minutesToMs = (minutes: string | number): number => {
  if (typeof minutes === 'string') {
    const parsed = parseInt(minutes, 10);
    return isNaN(parsed) ? 0 : parsed * MS * SECONDS_IN_MINUTE;
  }

  return minutes * MS * MINUTES_IN_HOUR;
};

export const hoursToMs = (hours: string | number): number => {
  if (typeof hours === 'string') {
    const parsed = parseInt(hours, 10);
    return isNaN(parsed) ? 0 : parsed * MS * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;
  }

  return hours * MS * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;
};

export const daysToMs = (days: string | number): number => {
  if (typeof days === 'string') {
    const parsed = parseInt(days, 10);
    return isNaN(parsed) ? 0 : parsed * MS * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * HOURS_IN_DAY;
  }

  return days * MS * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * HOURS_IN_DAY;
};
