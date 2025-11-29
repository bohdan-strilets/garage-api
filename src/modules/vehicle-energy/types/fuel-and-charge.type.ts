import { EnergyCharge, EnergyFuel } from '../schemas/subdocs';

export type FuelAndCharge = {
  fuel: EnergyFuel | null;
  charge: EnergyCharge | null;
};
