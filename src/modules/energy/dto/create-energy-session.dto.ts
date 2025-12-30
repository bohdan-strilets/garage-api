import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

import { ChargerType } from '../enums/charger-type.enum';
import { EnergyKind } from '../enums/energy-kind.enum';
import { FuelType } from '../enums/fuel-type.enum';

export class CreateEnergySessionDto {
  @IsEnum(EnergyKind)
  kind: EnergyKind;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsInt()
  @Min(0)
  odometerKm: number;

  @IsNumber()
  @Min(0)
  totalCostPln: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  stationName?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @ValidateIf((o) => o.kind === EnergyKind.FUEL)
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ValidateIf((o) => o.kind === EnergyKind.FUEL)
  @IsNumber()
  @Min(0)
  fuelVolumeLiters?: number;

  @ValidateIf((o) => o.kind === EnergyKind.FUEL)
  @IsNumber()
  @Min(0)
  fuelPricePerLiterPln?: number;

  @ValidateIf((o) => o.kind === EnergyKind.FUEL)
  @IsBoolean()
  fuelIsFull?: boolean;

  @ValidateIf((o) => o.kind === EnergyKind.CHARGE)
  @IsEnum(ChargerType)
  chargerType?: ChargerType;

  @ValidateIf((o) => o.kind === EnergyKind.CHARGE)
  @IsNumber()
  @Min(0)
  energyKwh?: number;

  @ValidateIf((o) => o.kind === EnergyKind.CHARGE)
  @IsNumber()
  @Min(0)
  pricePerKwhPln?: number;

  @ValidateIf((o) => o.kind === EnergyKind.CHARGE)
  @IsOptional()
  @IsNumber()
  @Min(0)
  powerKw?: number;

  @ValidateIf((o) => o.kind === EnergyKind.CHARGE)
  @IsOptional()
  @IsInt()
  @Min(0)
  durationMinutes?: number;

  @ValidateIf((o) => o.kind === EnergyKind.CHARGE)
  @IsBoolean()
  chargeIsFull?: boolean;
}
