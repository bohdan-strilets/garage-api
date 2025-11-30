import { CareSessionKind } from '../enums';

export type CareSessionInput = {
  ownerId: string;
  vehicleId: string;
  date: Date;
  odometer?: number;
  kind: CareSessionKind;
  price?: number;
  currency?: string;
  durationMinutes?: number;
  note?: string;
};
