import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HistoryDocument = HydratedDocument<History>;

@Schema({ versionKey: false, _id: false })
export class History {
  @Prop()
  manufacturerCountry: string;

  @Prop()
  whereWasBroughtFrom: string;

  @Prop({ default: new Date() })
  whenWasDelivered: Date;

  @Prop({ default: new Date() })
  firstRegistration: Date;

  @Prop({ default: new Date() })
  whenPurchased: Date;

  @Prop({ default: new Date() })
  whenSold: Date;
}
