import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { ImageKind, ImageOwner } from '../enums';

@Schema({ collection: 'images', timestamps: true, versionKey: false })
export class Image {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: String, enum: ImageOwner, required: true })
  ownerType: ImageOwner;

  @Prop({ type: String, enum: ImageKind, required: true })
  kind: ImageKind;

  @Prop({ type: Boolean, default: false })
  isSelected: boolean;

  @Prop({ type: String, required: true })
  publicId: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  secureUrl: string;

  @Prop({ type: String, required: true })
  folder: string;

  @Prop({ type: String, required: true })
  format: string;

  @Prop({ type: Number, required: true })
  bytes: number;

  @Prop({ type: Number, required: true })
  width: number;

  @Prop({ type: Number, required: true })
  height: number;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type ImageDocument = HydratedDocument<Image>;
export const ImageSchema = SchemaFactory.createForClass(Image);

ImageSchema.index({ ownerId: 1, ownerType: 1 });
ImageSchema.index({ publicId: 1 }, { unique: true });
ImageSchema.index({ ownerId: 1, ownerType: 1, kind: 1 });
