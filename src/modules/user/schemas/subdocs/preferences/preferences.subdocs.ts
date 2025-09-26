import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { Currency } from '@app/modules/user/enums/currency.enum';
import { Locale } from '@app/modules/user/enums/locale.enum';
import { Theme } from '@app/modules/user/enums/theme.enum';

import { Notifications, NotificationsSchema } from './notifications/notifications.subdocs';
import { Units, UnitsSchema } from './units.subdocs';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class Preferences {
  @Prop({ enum: Locale, default: Locale.POL })
  locale?: Locale;

  @Prop({ enum: Currency, default: Currency.PLN })
  currency?: Currency;

  @Prop({ type: String, default: 'Europe/Warsaw' })
  timezone?: string | null;

  @Prop({ enum: Theme, default: Theme.SYSTEM })
  theme?: Theme;

  @Prop({ type: UnitsSchema })
  units?: Units;

  @Prop({ type: NotificationsSchema })
  notifications?: Notifications;
}

export type PreferencesDocument = HydratedDocument<Preferences>;
export const PreferencesSchema = SchemaFactory.createForClass(Preferences);
