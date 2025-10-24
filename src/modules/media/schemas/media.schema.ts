import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Owner, OwnerSchema } from './subdocs/owner.subdoc';
import { Parameters, ParametersSchema } from './subdocs/parameters.subdoc';

import { MediaStatus } from '../enums/media-status.enum';
import { MediaType } from '../enums/media-type.enum';
import { Provider } from '../enums/provider.enum';
@Schema({ collection: 'media', timestamps: true, versionKey: false })
export class Media {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: OwnerSchema, default: {} })
  owner: Owner;

  @Prop({ enum: MediaType, required: true })
  type: MediaType;

  @Prop({ enum: Provider, default: Provider.CLOUDINARY })
  provider: Provider;

  @Prop({ type: String, required: true })
  providerPublicId: string;

  @Prop({ type: String, required: true })
  secureUrl: string;

  @Prop({ type: String, required: true })
  thumbUrl: string;

  @Prop({ type: ParametersSchema, default: {} })
  parameters: Parameters;

  @Prop({ enum: MediaStatus, required: true })
  status: MediaStatus;

  @Prop({ type: [String], default: [] })
  labels: string[];

  @Prop({ type: String, default: null })
  alt?: string | null;

  createdAt: Date;

  updatedAt: Date;
}

export type MediaDocument = HydratedDocument<Media>;
export const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.index({ userId: 1 });
MediaSchema.index({ providerPublicId: 1 }, { unique: true });
MediaSchema.index({ labels: 1 });
