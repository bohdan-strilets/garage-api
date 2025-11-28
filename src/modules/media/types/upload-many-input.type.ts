import { ImageKind, ImageOwner } from '../enums';

export type UploadManyInput = {
  ownerId: string;
  ownerType: ImageOwner;
  kind: ImageKind;
  files: Express.Multer.File[];
  selectFirst?: boolean;
};
