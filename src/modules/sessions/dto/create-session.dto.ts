export class CreateSessionDto {
  userId: string;
  refreshHash: string;
  fingerprint: string;
  userAgent: string;
  agent: string;
  ip: string;
  lastUsedAt: Date;
  expiresAt: Date;
  status: string;
}
