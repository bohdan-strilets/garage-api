import { CareSessionKind } from '../enums';

export type CareSessionFilters = {
  kind?: CareSessionKind;
  dateFrom?: string;
  dateTo?: string;
  odometerMin?: string;
  odometerMax?: string;
  priceMin?: string;
  priceMax?: string;
};
