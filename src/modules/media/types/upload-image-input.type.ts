import { ImageKind, ImageOwner } from '../enums';

export type UploadImageInput = {
  ownerId: string;
  ownerType: ImageOwner;
  kind: ImageKind;
  file: Express.Multer.File;
  select?: boolean;
};
