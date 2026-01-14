import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { VehicleIdentifiersDto } from './vehicle-identifiers.dto';
import { VehicleOdometerDto } from './vehicle-odometer.dto';
import { VehiclePurchaseDto } from './vehicle-purchase.dto';
import { VehicleSaleDto } from './vehicle-sale.dto';
import { VehicleTechnicalDto } from './vehicle-technical.dto';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  brand: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  model: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  generation?: string;

  @IsDefined()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehicleIdentifiersDto)
  identifiers: VehicleIdentifiersDto;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehicleOdometerDto)
  odometer: VehicleOdometerDto;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehiclePurchaseDto)
  purchase: VehiclePurchaseDto;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehicleSaleDto)
  sale: VehicleSaleDto;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehicleTechnicalDto)
  technical: VehicleTechnicalDto;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  notes?: string;
}
