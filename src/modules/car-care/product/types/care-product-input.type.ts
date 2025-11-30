import { CareUnit } from '../enums';
import { CareProductKind } from '../enums';

export type CareProductInput = {
  ownerId: string;
  vehicleId: string;
  name: string;
  kind: CareProductKind;
  quantity?: number;
  unit?: CareUnit;
  price?: number;
  currency?: string;
  purchaseDate?: Date;
  note?: string;
};
