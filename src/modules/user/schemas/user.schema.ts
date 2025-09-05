import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../enums/role.enum';
import { Address } from './subschemas/address.subschema';
import { Agreement } from './subschemas/agreements.subschema';
import { Contact } from './subschemas/contact.subschema';
import { Profile } from './subschemas/profile.subschema';
import { Security } from './subschemas/security.subschema';

@Schema({ timestamps: true, versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true, maxLength: 120 })
  firstName: string;

  @Prop({ type: String, required: true, maxLength: 120 })
  lastName: string;

  @Prop({ type: String, required: true, unique: true, maxLength: 254 })
  email: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles?: Role[];

  @Prop({ type: Profile, default: {} })
  profile: Profile;

  @Prop({ type: Address, default: {} })
  address: Address;

  @Prop({ type: Contact, default: {} })
  contact: Contact;

  @Prop({ type: Security, default: {} })
  security: Security;

  @Prop({ type: Agreement, default: {} })
  agreement: Agreement;

  createdAt: Date;

  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
