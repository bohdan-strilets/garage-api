import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  accountLocked,
  emailAlreadyVerified,
  emailVerificationResendTooSoon,
  invalidCredentials,
  invalidCurrentPassword,
  passwordSameAsCurrent,
  passwordUpdateFailed,
  refreshTokenReuseDetected,
  sessionInvalid,
  sessionNotFound,
  userAlreadyExists,
} from '@app/common/errors';
import {
  buildFullName,
  getNow,
  getNowTimestamp,
  objectIdToString,
  secondsToMs,
} from '@app/common/utils';
import { CryptoConfig, cryptoConfig } from '@app/config/env/name-space';

import { CryptoService } from '../crypto/crypto.service';
import { EmailService } from '../email';
import { PasswordService } from '../password/password.service';
import { RevokedBy } from '../session/enums';
import { SessionService } from '../session/session.service';
import { CreateSessionInput, Device, RotateInput } from '../session/types';
import { TokensService } from '../tokens/tokens.service';
import { AccessInput, RefreshInput } from '../tokens/types';
import { UpdateEmailDto } from '../user/dto';
import { CreateUserInput, UserSecurity } from '../user/types';
import { EmailVerificationInput } from '../user/types/email-verification-input';
import { UserService } from '../user/user.service';

import { ChangePasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto';
import { AuthInternalResult, AuthResponse, RefreshInternalResult } from './types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly tokensService: TokensService,
    private readonly cryptoService: CryptoService,
    private readonly emailService: EmailService,
    @Inject(cryptoConfig.KEY) private readonly crypto: CryptoConfig,
  ) {}

  private defaultFingerprint(): string {
    return `sess-${this.cryptoService.randomToken(16)}`;
  }

  async register(
    dto: RegisterDto,
    userAgent: string,
    ip: string,
    device: Device,
    fingerprint: string | null,
  ): Promise<AuthInternalResult> {
    const { email, password, firstName, lastName } = dto;
    const exists = await this.userService.existsActiveByEmail(email);

    if (exists) {
      userAlreadyExists();
    }

    const passwordHash = await this.passwordService.hashIfValid(password);
    const emailVerifyToken = this.userService.generateEmailVerifyToken();

    const createInput: CreateUserInput = {
      firstName,
      lastName,
      email,
      passwordHash,
      verifyEmailTokenHash: emailVerifyToken.hash,
      verifyEmailTokenExpiresAt: emailVerifyToken.expiresAt,
    };

    const user = await this.userService.createUser(createInput);
    const { _id, profile, roles } = user;

    const userId = objectIdToString(_id);
    const userName = buildFullName(profile.firstName, profile.lastName);

    const jti = this.tokensService.generateJti();
    const familyId = this.sessionService.generateFamilyId();

    const accessInput: AccessInput = { userId, roles, jti };
    const refreshInput: RefreshInput = { userId, jti };

    const accessToken = await this.tokensService.signAccess(accessInput);
    const refreshToken = await this.tokensService.signRefresh(refreshInput);

    const refreshTokenHash = this.tokensService.hashToken(refreshToken.token);
    const now = getNow();

    const fingerprintValue = fingerprint ?? this.defaultFingerprint();

    const sessionInput: CreateSessionInput = {
      userId,
      familyId,
      jti,
      refreshTokenHash,
      fingerprint: fingerprintValue,
      userAgent,
      ip,
      device,
      lastUsedAt: now,
      expiresAt: new Date(secondsToMs(refreshToken.exp)),
    };

    await this.sessionService.start(sessionInput);

    await this.emailService.sendWelcomeVerificationEmail({
      to: email,
      token: emailVerifyToken.plain,
      userName,
    });

    return {
      user,
      accessToken: accessToken.token,
      refreshToken: refreshToken,
    };
  }

  async login(
    dto: LoginDto,
    userAgent: string,
    ip: string,
    device: Device,
    fingerprint: string | null,
  ): Promise<AuthInternalResult> {
    const { email, password } = dto;

    const securityUser = await this.userService.findSecurityUserByEmail(email);
    const userId = objectIdToString(securityUser._id);

    const isLocked = await this.userService.isLockedById(userId);

    if (isLocked) {
      accountLocked();
    }

    const passwordHash = securityUser.security.password.hash;
    const passwordOk = await this.passwordService.verify(password, passwordHash);

    if (!passwordOk) {
      await this.userService.bumpFailuresAndLockIfNeeded(userId);
      invalidCredentials();
    }

    await this.userService.resetFailures(userId);

    const jti = this.tokensService.generateJti();
    const familyId = this.sessionService.generateFamilyId();

    const accessInput: AccessInput = { userId, roles: securityUser.roles, jti };
    const refreshInput: RefreshInput = { userId, jti };

    const accessToken = await this.tokensService.signAccess(accessInput);
    const refreshToken = await this.tokensService.signRefresh(refreshInput);

    const refreshTokenHash = this.cryptoService.hmacSign(refreshToken.token);
    const now = getNow();

    const fingerprintValue = fingerprint ?? this.defaultFingerprint();

    const sessionInput: CreateSessionInput = {
      userId,
      familyId,
      jti,
      refreshTokenHash,
      fingerprint: fingerprintValue,
      userAgent,
      ip,
      device,
      lastUsedAt: now,
      expiresAt: new Date(secondsToMs(refreshToken.exp)),
    };

    await this.sessionService.start(sessionInput);
    const selfUser = await this.userService.findSelfUserById(userId);

    return {
      user: selfUser,
      accessToken: accessToken.token,
      refreshToken: refreshToken,
    };
  }

  async logout(jti: string): Promise<boolean> {
    return await this.sessionService.logoutByJti(jti, RevokedBy.User);
  }

  async refresh(
    oldJti: string,
    userAgent: string,
    ip: string,
    device: Device,
    fingerprint: string | null,
  ): Promise<RefreshInternalResult> {
    const oldSession = await this.sessionService.getByJti(oldJti);

    if (!oldSession || oldSession.revokedAt) {
      sessionInvalid();
    }

    if (oldSession.reuseDetectedAt) {
      refreshTokenReuseDetected();
    }

    const userId = objectIdToString(oldSession.userId);
    const userSecurity = await this.userService.findSecurityUserById(userId);

    const jti = this.tokensService.generateJti();

    const accessInput: AccessInput = { userId, roles: userSecurity.roles, jti };
    const refreshInput: RefreshInput = { userId, jti };

    const accessToken = await this.tokensService.signAccess(accessInput);
    const refreshToken = await this.tokensService.signRefresh(refreshInput);

    const refreshTokenHash = this.cryptoService.hmacSign(refreshToken.token);
    const now = getNow();

    const fingerprintValue = fingerprint ?? this.defaultFingerprint();

    const sessionInput: CreateSessionInput = {
      userId,
      familyId: oldSession.familyId,
      jti,
      refreshTokenHash,
      fingerprint: fingerprintValue,
      userAgent,
      ip,
      device,
      lastUsedAt: now,
      expiresAt: new Date(secondsToMs(refreshToken.exp)),
    };

    const rotateInput: RotateInput = {
      oldJti,
      newSession: sessionInput,
      reason: 'Token refresh',
      by: RevokedBy.System,
    };

    await this.sessionService.rotate(rotateInput);

    return {
      accessToken: accessToken.token,
      refreshToken,
    };
  }

  async me(refreshToken: string): Promise<AuthResponse> {
    if (!refreshToken) {
      sessionNotFound();
    }

    const payload = await this.tokensService.verifyRefresh(refreshToken);

    if (!payload) {
      sessionInvalid();
    }

    const session = await this.sessionService.getByJti(payload.jti);

    if (!session || session.revokedAt) {
      sessionInvalid();
    }

    const userId = objectIdToString(session.userId);
    const user = await this.userService.findSelfUserById(userId);

    const accessInput: AccessInput = {
      userId,
      roles: user.roles,
      jti: payload.jti,
    };
    const accessToken = await this.tokensService.signAccess(accessInput);

    return {
      user,
      accessToken: accessToken.token,
    };
  }

  async requestResetPassword(dto: UpdateEmailDto): Promise<void> {
    const { email } = dto;
    let user: UserSecurity;

    try {
      user = await this.userService.findSecurityUserByEmail(email);
    } catch {
      this.logger.debug(`No user found with email: ${email}`);
      return;
    }

    const { profile, _id } = user;

    const resetToken = this.cryptoService.randomToken(32);
    const resetTokenHash = this.cryptoService.hmacSign(resetToken);

    const userId = objectIdToString(_id);
    const userName = buildFullName(profile.firstName, profile.lastName);

    await this.userService.setPasswordResetToken(userId, resetTokenHash);

    await this.emailService.sendResetPasswordEmail({
      to: email,
      token: resetToken,
      userName,
    });
  }

  async resetPassword(resetToken: string, dto: ResetPasswordDto): Promise<void> {
    const resetTokenHash = this.cryptoService.hmacSign(resetToken);
    const user = await this.userService.findSecurityUserByResetToken(resetTokenHash);
    const { profile, _id, email } = user;

    const { newPassword } = dto;
    const userId = objectIdToString(_id);
    const passwordHash = await this.passwordService.hashIfValid(newPassword);

    const updated = await this.userService.updatePassword(userId, passwordHash);

    if (!updated) {
      passwordUpdateFailed();
    }

    await this.userService.clearPasswordResetToken(userId);
    await this.sessionService.logoutAll(userId, RevokedBy.System);

    const userName = buildFullName(profile.firstName, profile.lastName);

    await this.emailService.sendResetPasswordSuccessEmail({
      to: email,
      userName,
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = dto;

    const securityUser = await this.userService.findSecurityUserById(userId);
    const { profile, email, security } = securityUser;

    const userName = buildFullName(profile.firstName, profile.lastName);

    const passwordHash = security.password.hash;
    const isCurrentValid = await this.passwordService.verify(currentPassword, passwordHash);

    if (!isCurrentValid) {
      invalidCurrentPassword();
    }

    if (currentPassword === newPassword) {
      passwordSameAsCurrent();
    }

    const newPasswordHash = await this.passwordService.hashIfValid(newPassword);

    const updated = await this.userService.updatePassword(userId, newPasswordHash);

    if (!updated) {
      passwordUpdateFailed();
    }

    await this.sessionService.logoutAll(userId, RevokedBy.System);

    await this.emailService.sendPasswordChangedEmail({
      to: email,
      userName,
    });

    this.logger.debug('Send email for success changed password for user');
  }

  async verifyEmail(plainToken: string): Promise<void> {
    await this.userService.verifyEmail(plainToken);
    this.logger.debug('Send email for success email verification for user');
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    const user = await this.userService.getUserForRetry(userId);

    if (user.verification.email.isVerified) {
      emailAlreadyVerified();
    }

    const lastSentAt = user.verification.email.sentAt;
    const now = getNowTimestamp();
    const VERIFICATION_COOLDOWN_MS = this.crypto.email.verificationCooldownMs;

    if (lastSentAt && now - lastSentAt.getTime() < VERIFICATION_COOLDOWN_MS) {
      emailVerificationResendTooSoon();
    }

    const emailVerifyToken = this.userService.generateEmailVerifyToken();

    const emailVerificationInput: EmailVerificationInput = {
      tokenHash: emailVerifyToken.hash,
      expiresAt: emailVerifyToken.expiresAt,
      sentAt: emailVerifyToken.sentAt,
    };

    await this.userService.updateEmailVerificationToken(userId, emailVerificationInput);

    const { email, profile } = user;
    const userName = buildFullName(profile.firstName, profile.lastName);

    await this.emailService.sendWelcomeVerificationEmail({
      to: email,
      token: emailVerifyToken.plain,
      userName,
    });
  }
}
