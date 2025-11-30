import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class MaintenancePartDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  partNumber?: string;

  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @IsNumber()
  @Min(0)
  quantity: number;
}
