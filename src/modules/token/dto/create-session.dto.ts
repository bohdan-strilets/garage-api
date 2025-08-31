import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsMongoId()
  userId: string;

  @IsString()
  jti: string;

  @IsString()
  family: string;

  @IsString()
  refreshHash: string;

  @Type(() => Date)
  @IsDate()
  expiresAt: Date;

  @IsString()
  @IsOptional()
  userAgent: string;

  @IsString()
  @IsOptional()
  ip: string;
}
