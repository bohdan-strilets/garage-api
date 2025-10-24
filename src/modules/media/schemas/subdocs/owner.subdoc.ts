import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { MediaOwnerType } from '../../enums/media-owner-type.enum';

@Schema({ _id: false, versionKey: false })
export class Owner {
  @Prop({ type: Types.ObjectId, required: true })
  id: Types.ObjectId;

  @Prop({ enum: MediaOwnerType, required: true })
  type: MediaOwnerType;
}

export type OwnerDocument = HydratedDocument<Owner>;
export const OwnerSchema = SchemaFactory.createForClass(Owner);
