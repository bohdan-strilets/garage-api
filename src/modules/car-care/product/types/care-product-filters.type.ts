import { CareProductKind } from '../enums';

export type CareProductFilters = {
  kind?: CareProductKind;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: string;
  priceMax?: string;
};
