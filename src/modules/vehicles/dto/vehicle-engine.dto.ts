import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class VehicleEngineDto {
  @IsOptional()
  @IsInt()
  @Min(600)
  @Max(8000)
  displacementCc?: number;

  @IsOptional()
  @IsInt()
  @Min(40)
  @Max(1200)
  powerHp?: number;

  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(900)
  powerKw?: number;

  @IsOptional()
  @IsInt()
  @Min(50)
  @Max(1500)
  torqueNm?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  cylinders?: number;
}
