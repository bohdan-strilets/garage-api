import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum } from '../enums/gender.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null, minlength: 6, maxlength: 16 })
  password: string;

  @Prop({ default: null })
  dateBirth: Date;

  @Prop({ default: GenderEnum.OTHER, enum: GenderEnum })
  gender: GenderEnum;

  @Prop({ default: null })
  avatarUrl: string;

  @Prop({ default: null })
  activationToken: string;

  @Prop({ default: false })
  isActivated: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
