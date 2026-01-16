import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmptyObject,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { BodyType, Drivetrain, FuelType, Transmission } from '../enums';

import { VehicleAppearanceDto } from './vehicle-appearance.dto';
import { VehicleCapacityDto } from './vehicle-capacity.dto';
import { VehicleDimensionsDto } from './vehicle-dimensions.dto';
import { VehicleEconomyDto } from './vehicle-economy.dto';
import { VehicleEngineDto } from './vehicle-engine.dto';
import { VehiclePerformanceDto } from './vehicle-performance.dto';

export class VehicleTechnicalDto {
  @IsDefined()
  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsDefined()
  @IsEnum(Transmission)
  transmission: Transmission;

  @IsDefined()
  @IsEnum(Drivetrain)
  drivetrain: Drivetrain;

  @IsDefined()
  @IsEnum(BodyType)
  bodyType: BodyType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  doors?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(9)
  seats?: number;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehicleEngineDto)
  engine: VehicleEngineDto;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehicleEconomyDto)
  economy: VehicleEconomyDto;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehicleDimensionsDto)
  dimensions: VehicleDimensionsDto;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehicleCapacityDto)
  capacity: VehicleCapacityDto;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehiclePerformanceDto)
  performance: VehiclePerformanceDto;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehicleAppearanceDto)
  appearance: VehicleAppearanceDto;
}
