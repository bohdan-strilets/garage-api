import { UserSchema } from './user.schema';

UserSchema.index({ isActive: 1, role: 1 });
UserSchema.index({ 'profile.nickname': 1 });

export { UserSchema };
