import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Channels, ChannelsSchema } from './channels.subdoc';
import { Digests, DigestsSchema } from './digests.subdoc';

@Schema({ _id: false, versionKey: false })
export class Notifications {
  @Prop({ type: ChannelsSchema, default: {} })
  channels?: Channels;

  @Prop({ type: DigestsSchema, default: {} })
  digests?: Digests;
}

export type NotificationsDocument = HydratedDocument<Notifications>;
export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
