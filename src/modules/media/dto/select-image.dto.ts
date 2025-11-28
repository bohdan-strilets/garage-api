import { IsEnum, IsMongoId } from 'class-validator';

import { ImageKind, ImageOwner } from '../enums';

export class SelectImageDto {
  @IsMongoId()
  ownerId: string;

  @IsEnum(ImageOwner)
  ownerType: ImageOwner;

  @IsEnum(ImageKind)
  kind: ImageKind;

  @IsMongoId()
  imageId: string;
}
