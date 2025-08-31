import { SessionSchema } from './session.schema';

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
SessionSchema.index({ revokedAt: 1, expiresAt: 1 });
SessionSchema.index({ family: 1 });

export { SessionSchema };
