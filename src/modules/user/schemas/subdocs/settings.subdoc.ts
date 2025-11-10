import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Currency, Locale, Theme, Timezone } from '@app/common/enums';

import {
  NotificationsSettings,
  NotificationsSettingsSchema,
} from './notifications-settings.subdoc';
import { Units, UnitsSchema } from './units.subdoc';

@Schema({ _id: false, timestamps: false })
export class Settings {
  @Prop({ type: UnitsSchema, default: {} })
  units: Units;

  @Prop({ enum: Locale, default: Locale.PL_PL })
  locale: Locale;

  @Prop({ enum: Timezone, default: Timezone.EUROPE_WARSAW })
  timezone: Timezone;

  @Prop({ enum: Theme, default: Theme.SYSTEM })
  theme: Theme;

  @Prop({ enum: Currency, default: Currency.PLN })
  currency: Currency;

  @Prop({ type: NotificationsSettingsSchema, default: {} })
  notifications: NotificationsSettings;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
