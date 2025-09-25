import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { Locale } from '@app/user/enums/locale.enum';

import { Channels, ChannelsSchema } from './channels.subdocs';
import { Reminders, RemindersSchema } from './reminders.subdocs';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class Notifications {
  @Prop({ type: ChannelsSchema })
  channels?: Channels;

  @Prop({ type: RemindersSchema })
  reminders?: Reminders;

  @Prop({ enum: Locale, default: Locale.POL })
  languageOverride?: Locale;
}

export type NotificationsDocument = HydratedDocument<Notifications>;
export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
