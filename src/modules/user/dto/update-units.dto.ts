import { IsEnum, IsOptional } from 'class-validator';

import {
  DistanceUnit,
  FuelEconomyUnit,
  PressureUnit,
  SpeedUnit,
  TemperatureUnit,
  VolumeUnit,
} from '@app/common/enums';

export class UpdateUnitsDto {
  @IsOptional()
  @IsEnum(DistanceUnit)
  distance?: DistanceUnit;

  @IsOptional()
  @IsEnum(VolumeUnit)
  volume?: VolumeUnit;

  @IsOptional()
  @IsEnum(SpeedUnit)
  speed?: SpeedUnit;

  @IsOptional()
  @IsEnum(FuelEconomyUnit)
  fuelEconomy?: FuelEconomyUnit;

  @IsOptional()
  @IsEnum(TemperatureUnit)
  temperature?: TemperatureUnit;

  @IsOptional()
  @IsEnum(PressureUnit)
  pressure?: PressureUnit;
}
