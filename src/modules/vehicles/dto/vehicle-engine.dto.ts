import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class VehicleEngineDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  displacementCc?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(1)
  powerHp?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(1)
  powerKw?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(1)
  torqueNm?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  cylinders?: number | null;
}
