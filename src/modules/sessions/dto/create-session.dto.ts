import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  userId: string;

  @IsString()
  refreshTokenHash: string;

  @IsDate()
  expiresAt: Date;

  @IsString()
  @IsOptional()
  userAgent?: string | null;

  @IsString()
  @IsOptional()
  ip?: string | null;
}
