import { FuelEnum } from '../enums/fuel.enum';
import { FuelConsumptionType } from './fuel-consumption.type';

export type EngineType = {
  engineCapacity: number;
  enginePower: number;
  fuelType: FuelEnum;
  fuelConsumption: FuelConsumptionType;
};
