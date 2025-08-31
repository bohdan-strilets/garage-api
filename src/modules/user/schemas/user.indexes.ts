import { UserSchema } from './user.schema';

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ createdAt: 1 });
UserSchema.index({ 'security.roles': 1 });

export { UserSchema };
