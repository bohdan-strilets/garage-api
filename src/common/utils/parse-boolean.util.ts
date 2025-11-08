export const parseBoolean = (value: unknown, defaultValue = false) =>
  String(value ?? '').trim() === ''
    ? defaultValue
    : ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
