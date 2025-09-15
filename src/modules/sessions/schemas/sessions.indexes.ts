import { SessionSchema } from './session.schema';

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
SessionSchema.index({ userId: 1, isActive: 1 });

export { SessionSchema };
