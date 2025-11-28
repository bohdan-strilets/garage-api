import { ImageKind, ImageOwner } from '../enums';

export type CreateImageInput = {
  ownerId: string;
  ownerType: ImageOwner;
  kind: ImageKind;
  publicId: string;
  url: string;
  secureUrl: string;
  folder: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  isSelected?: boolean;
};
