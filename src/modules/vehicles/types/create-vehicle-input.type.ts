import type {
  VehicleIdentifiers,
  VehicleOdometer,
  VehiclePurchase,
  VehicleSale,
  VehicleTechnical,
} from '../schemas/subdocs';

export type CreateVehicleInput = {
  ownerId: string;
  name?: string | null;
  brand: string;
  model: string;
  generation?: string | null;
  year: number;
  identifiers: VehicleIdentifiers;
  odometer: VehicleOdometer;
  purchase: VehiclePurchase;
  sale?: VehicleSale;
  technical: VehicleTechnical;
  notes?: string | null;
};
