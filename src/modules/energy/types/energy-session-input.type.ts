import { EnergyKind } from '../enums';
import { EnergyCharge, EnergyFuel } from '../schemas/subdocs';

export type EnergySessionInput = {
  ownerId: string;
  vehicleId: string;
  kind: EnergyKind;
  date: Date;
  odometerKm: number;
  totalCostPln: number;
  currency: string;
  stationName?: string;
  notes?: string;
  fuel?: EnergyFuel | null;
  charge?: EnergyCharge | null;
};
