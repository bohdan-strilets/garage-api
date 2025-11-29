import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator';

import { BodyType, Drivetrain, FuelType, Transmission } from '../enums';

import { VehicleAppearanceDto } from './vehicle-appearance.dto';
import { VehicleCapacityDto } from './vehicle-capacity.dto';
import { VehicleDimensionsDto } from './vehicle-dimensions.dto';
import { VehicleEconomyDto } from './vehicle-economy.dto';
import { VehicleEngineDto } from './vehicle-engine.dto';
import { VehiclePerformanceDto } from './vehicle-performance.dto';

export class VehicleTechnicalDto {
  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsEnum(Transmission)
  transmission: Transmission;

  @IsOptional()
  @IsEnum(Drivetrain)
  drivetrain?: Drivetrain | null;

  @IsOptional()
  @IsEnum(BodyType)
  bodyType?: BodyType | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  doors?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  seats?: number;

  @ValidateNested()
  @Type(() => VehicleEngineDto)
  engine: VehicleEngineDto;

  @ValidateNested()
  @Type(() => VehicleEconomyDto)
  economy: VehicleEconomyDto;

  @ValidateNested()
  @Type(() => VehicleDimensionsDto)
  dimensions: VehicleDimensionsDto;

  @ValidateNested()
  @Type(() => VehicleCapacityDto)
  capacity: VehicleCapacityDto;

  @ValidateNested()
  @Type(() => VehiclePerformanceDto)
  performance: VehiclePerformanceDto;

  @ValidateNested()
  @Type(() => VehicleAppearanceDto)
  appearance: VehicleAppearanceDto;
}
