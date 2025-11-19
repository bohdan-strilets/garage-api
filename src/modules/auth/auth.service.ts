import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { getNow, objectIdToString, secondsToMs } from '@app/common/utils';

import { CryptoService } from '../crypto/crypto.service';
import { PasswordService } from '../password/password.service';
import { RevokedBy } from '../session/enums';
import { SessionService } from '../session/session.service';
import { CreateSessionInput, Device, RotateInput } from '../session/types';
import { TokensService } from '../tokens/tokens.service';
import { AccessInput, RefreshInput } from '../tokens/types';
import { CreateUserInput, UserSecurity } from '../user/types';
import { UserService } from '../user/user.service';

import { ChangePasswordDto, EmailDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto';
import { AuthInternalResult, RefreshInternalResult } from './types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly tokensService: TokensService,
    private readonly cryptoService: CryptoService,
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
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.passwordService.hashIfValid(password);
    const createInput: CreateUserInput = {
      firstName,
      lastName,
      email,
      passwordHash,
    };

    const user = await this.userService.createUser(createInput);
    const userId = objectIdToString(user._id);

    const jti = this.tokensService.generateJti();
    const familyId = this.sessionService.generateFamilyId();

    const accessInput: AccessInput = { userId, roles: user.roles, jti };
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
      throw new UnauthorizedException('Account is locked');
    }

    const passwordHash = securityUser.security.password.hash;
    const passwordOk = await this.passwordService.verify(password, passwordHash);

    if (!passwordOk) {
      await this.userService.bumpFailuresAndLockIfNeeded(userId);
      throw new UnauthorizedException('Invalid credentials');
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
      throw new UnauthorizedException('Session not found or revoked');
    }

    if (oldSession.reuseDetectedAt) {
      throw new UnauthorizedException('Refresh token family was revoked');
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

  async me(userId: string) {
    return this.userService.findSelfUserById(userId);
  }

  async requestResetPassword(dto: EmailDto): Promise<void> {
    const { email } = dto;
    let user: UserSecurity;

    try {
      user = await this.userService.findSecurityUserByEmail(email);
    } catch {
      this.logger.debug(`No user found with email: ${email}`);
      return;
    }

    const resetToken = this.cryptoService.randomToken(32);
    const resetTokenHash = this.cryptoService.hmacSign(resetToken);

    const userId = objectIdToString(user._id);
    await this.userService.setPasswordResetToken(userId, resetTokenHash);

    this.logger.debug(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(resetToken: string, dto: ResetPasswordDto): Promise<void> {
    const resetTokenHash = this.cryptoService.hmacSign(resetToken);
    const user = await this.userService.findSecurityUserByResetToken(resetTokenHash);

    const { newPassword } = dto;
    const userId = objectIdToString(user._id);
    const passwordHash = await this.passwordService.hashIfValid(newPassword);

    const updated = await this.userService.updatePassword(userId, passwordHash);

    if (!updated) {
      throw new BadRequestException('Failed to update password');
    }

    await this.userService.clearPasswordResetToken(userId);
    await this.sessionService.logoutAll(userId, RevokedBy.System);

    this.logger.debug('Send email for success reset password for user');
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = dto;

    const securityUser = await this.userService.findSecurityUserById(userId);
    const passwordHash = securityUser.security.password.hash;

    const isCurrentValid = await this.passwordService.verify(currentPassword, passwordHash);

    if (!isCurrentValid) {
      throw new UnauthorizedException('Current password is invalid');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const newPasswordHash = await this.passwordService.hashIfValid(newPassword);

    const updated = await this.userService.updatePassword(userId, newPasswordHash);

    if (!updated) {
      throw new BadRequestException('Failed to update password');
    }

    await this.sessionService.logoutAll(userId, RevokedBy.System);

    this.logger.debug('Send email for success changed password for user');
  }
}
