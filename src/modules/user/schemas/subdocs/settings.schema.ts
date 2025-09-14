import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Languages } from '../../enums/languages.enum';
import { Notifications } from '../../enums/notifications.enum';
import { Themes } from '../../enums/themes.enum';

@Schema({ timestamps: false, versionKey: false, _id: false })
export class Settings {
  @Prop({ enum: Notifications, default: Notifications.ALL })
  notifications?: Notifications;

  @Prop({ enum: Themes, default: Themes.SYSTEM })
  theme?: Themes;

  @Prop({ enum: Languages, default: Languages.ENGLISH })
  language?: Languages;
}

export type SettingsDocument = HydratedDocument<Settings>;
export const SettingsSchema = SchemaFactory.createForClass(Settings);
