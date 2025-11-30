import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { MaintenanceKind } from '../enums/maintenance-kind.enum';
import { MaintenanceStatus } from '../enums/maintenance-status.enum';

import { MaintenancePartDto } from './maintenance-part.dto';

export class CreateMaintenanceDto {
  @IsEnum(MaintenanceKind)
  kind: MaintenanceKind;

  @IsEnum(MaintenanceStatus)
  @IsOptional()
  status?: MaintenanceStatus;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNumber()
  @Min(0)
  odometer: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  totalCost: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  workshopName?: string;

  @IsString()
  @IsOptional()
  serviceType?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  nextServiceOdometer?: number;

  @Type(() => Date)
  @IsOptional()
  nextServiceDate?: Date;

  @IsString()
  @IsOptional()
  repairArea?: string;

  @IsBoolean()
  @IsOptional()
  underWarranty?: boolean;

  @IsBoolean()
  @IsOptional()
  isAccidentRelated?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaintenancePartDto)
  @IsOptional()
  parts?: MaintenancePartDto[];
}
