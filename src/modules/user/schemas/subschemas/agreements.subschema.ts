import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: false, versionKey: false, _id: false })
export class Agreement {
  @Prop({ type: Date, default: null })
  termsAcceptedAt?: Date | null;

  @Prop({ type: Boolean, default: false })
  marketing?: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}

export type AgreementDocument = HydratedDocument<Agreement>;
export const AgreementSchema = SchemaFactory.createForClass(Agreement);
