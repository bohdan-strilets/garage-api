import { IsArray, IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { DrivingCategory } from '../enums';

export class UpdateDrivingLicenseDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  number?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(DrivingCategory, { each: true })
  categories?: DrivingCategory[];

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  documentUrl?: string;
}
