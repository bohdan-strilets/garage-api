import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GalleryPhotoType } from '../types/gallery-photo.type';

export type PhotoDocument = HydratedDocument<Photo>;

@Schema({ versionKey: false, _id: false })
export class Photo {
  @Prop()
  mainPhoto: string;

  @Prop({ default: [] })
  photoGallery: GalleryPhotoType[];
}
