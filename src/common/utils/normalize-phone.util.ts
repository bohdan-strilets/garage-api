import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';

export const normalizePhone = (
  phone: string | null,
  defaultCountry: CountryCode = 'PL',
  throwOnError: boolean = false,
): string | null => {
  if (!phone) {
    return null;
  }

  const trimmed = phone.trim();
  const parsed = parsePhoneNumberFromString(trimmed, defaultCountry);

  if (parsed && parsed.isValid()) {
    return parsed.number;
  }

  if (throwOnError) {
    throw new Error('Invalid phone number');
  }

  return null;
};
