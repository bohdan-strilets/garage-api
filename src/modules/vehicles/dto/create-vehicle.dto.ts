import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

import { VehicleIdentifiersDto } from './vehicle-identifiers.dto';
import { VehicleOdometerDto } from './vehicle-odometer.dto';
import { VehiclePurchaseDto } from './vehicle-purchase.dto';
import { VehicleSaleDto } from './vehicle-sale.dto';
import { VehicleTechnicalDto } from './vehicle-technical.dto';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsOptional()
  @IsString()
  generation?: string | null;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ValidateNested()
  @Type(() => VehicleIdentifiersDto)
  identifiers: VehicleIdentifiersDto;

  @ValidateNested()
  @Type(() => VehicleOdometerDto)
  odometer: VehicleOdometerDto;

  @ValidateNested()
  @Type(() => VehiclePurchaseDto)
  purchase: VehiclePurchaseDto;

  @ValidateNested()
  @Type(() => VehicleSaleDto)
  sale: VehicleSaleDto;

  @ValidateNested()
  @Type(() => VehicleTechnicalDto)
  technical: VehicleTechnicalDto;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
