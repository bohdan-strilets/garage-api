import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ImageKind, ImageOwner } from '../enums';

export class UploadDto {
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsEnum(ImageOwner)
  ownerType: ImageOwner;

  @IsEnum(ImageKind)
  kind: ImageKind;

  @IsOptional()
  @IsBoolean()
  select?: boolean;
}
