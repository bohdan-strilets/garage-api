import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { CryptoService } from '@modules/crypto';
import { EmailService } from '@modules/email';
import { PasswordService } from '@modules/password';
import { SessionsService } from '@modules/sessions';
import { SessionDocument } from '@modules/sessions/schemas/session.schema';
import { CreateSessionInput } from '@modules/sessions/types/create-session.input.type';
import { Device } from '@modules/sessions/types/device.type';
import { CookieAdapter } from '@modules/token';
import { TokenService } from '@modules/token/token.service';
import { UserService } from '@modules/user';
import { CreateUserInput } from '@modules/user/types/create-user-input.type';
import { SafeUser } from '@modules/user/types/safe-user.type';

import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './types/auth-response.type';
import { AuthUser } from './types/auth-user.type';
import { LogoutResponse } from './types/logout-response.type';

@Injectable()
export class AuthService {
  private readonly apiBaseUrl: string;
  private readonly clientUrl: string;
  private readonly passwordResetTokenExpiry: string;

  constructor(
    private readonly userService: UserService,
    private readonly sessionsService: SessionsService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly cookieAdapter: CookieAdapter,
    private readonly cryptoService: CryptoService,
    private readonly emailService: EmailService,
  ) {
    this.apiBaseUrl = this.configService.get<string>('API_BASE_URL');
    this.passwordResetTokenExpiry = this.configService.get<string>(
      'PASSWORD_RESET_TOKEN_EXPIRATION_HOURS',
    );
    this.clientUrl = this.configService.get<string>('CLIENT_BASE_URL');
  }

  async register(dto: RegisterDto, device: Device, res: Response): Promise<AuthResponse> {
    const { email, password, firstName } = dto;
    const emailAvailable = await this.userService.isEmailAvailable(email);

    if (!emailAvailable) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await this.passwordService.hashAndValidate(password);
    const verifyEmailToken = this.cryptoService.generateResetToken();
    const userInput: CreateUserInput = {
      ...dto,
      hashedPassword,
      verifyEmailToken,
    };

    const user = await this.userService.createForAuth(userInput);
    const userId = user._id.toString();

    const sid = this.sessionsService.generateSid();
    const tokens = await this.tokenService.issuePair(userId, user.role, sid);
    const refreshTokenHash = await this.tokenService.hashRefreshToken(tokens.refreshToken);

    const sessionInput: CreateSessionInput = {
      sid,
      userId,
      refreshTokenHash,
      refreshExpiresAt: tokens.refreshExpiresAt,
      device,
    };

    await this.sessionsService.createInitial(sessionInput);

    const verifyUrl = `${this.apiBaseUrl}/auth/verify?token=${verifyEmailToken}`;

    await this.emailService.send('verify-email', email, { verifyUrl, userName: firstName });

    this.cookieAdapter.setRefreshCookie(res, tokens.refreshToken, tokens.refreshExpiresAt);

    const safeUser = await this.userService.getByIdSafe(userId);

    return {
      accessToken: tokens.accessToken,
      accessExpiresAt: tokens.accessExpiresAt,
      user: safeUser,
    };
  }

  async loginWithUser(user: SafeUser, device: Device, res: Response): Promise<AuthResponse> {
    const sid = this.sessionsService.generateSid();
    const userId = user._id.toString();

    const tokens = await this.tokenService.issuePair(userId, user.role, sid);
    const refreshTokenHash = await this.tokenService.hashRefreshToken(tokens.refreshToken);

    const sessionInput: CreateSessionInput = {
      sid,
      userId,
      refreshTokenHash,
      refreshExpiresAt: tokens.refreshExpiresAt,
      device,
    };

    await this.sessionsService.createInitial(sessionInput);

    this.cookieAdapter.setRefreshCookie(res, tokens.refreshToken, tokens.refreshExpiresAt);

    const safeUser = await this.userService.getByIdSafe(userId);

    return {
      accessToken: tokens.accessToken,
      accessExpiresAt: tokens.accessExpiresAt,
      user: safeUser,
    };
  }

  async refresh(res: Response, session: SessionDocument, user: AuthUser): Promise<AuthResponse> {
    const { role: userRole, sid, sub: userId } = user;

    const tokens = await this.tokenService.issuePair(userId, userRole, sid);
    const refreshTokenHash = await this.tokenService.hashRefreshToken(tokens.refreshToken);

    await this.sessionsService.rotateBySession(
      session.sid,
      refreshTokenHash,
      tokens.refreshExpiresAt,
    );

    this.cookieAdapter.setRefreshCookie(res, tokens.refreshToken, tokens.refreshExpiresAt);

    const safeUser = await this.userService.getByIdSafe(userId);

    return {
      accessToken: tokens.accessToken,
      accessExpiresAt: tokens.accessExpiresAt,
      user: safeUser,
    };
  }

  async logout(res: Response, user: AuthUser): Promise<LogoutResponse> {
    const { sid, sub: userId } = user;
    await this.sessionsService.revokeBySid(sid, userId);

    this.cookieAdapter.clearRefreshCookie(res);
    return { ok: true };
  }

  async logoutAll(res: Response, userId: string): Promise<LogoutResponse> {
    await this.sessionsService.revokeAllForUser(userId);
    this.cookieAdapter.clearRefreshCookie(res);
    return { ok: true };
  }

  async me(userId: string): Promise<SafeUser> {
    return await this.userService.getByIdSafe(userId);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.getByEmailForAuth(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { expiresAt, tokenHash } = await this.passwordService.generateResetToken();

    const userId = user._id.toString();
    const firstName = user.profile.firstName;

    await this.userService.updateResetToken(userId, tokenHash, expiresAt);
    console.log(tokenHash);

    const resetUrl = `${this.clientUrl}/auth/password/reset?token=${tokenHash}`;

    await this.emailService.send('password-reset', email, {
      resetUrl,
      userName: firstName,
      expiresIn: `${this.passwordResetTokenExpiry} hours`,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.passwordService.hashAndValidate(newPassword);

    const { passwordExpiresAt } = this.passwordService.computePasswordDates();

    const updatedUser = await this.userService.resetPasswordByToken(
      token,
      hashedPassword,
      passwordExpiresAt,
    );

    const userId = updatedUser._id.toString();
    await this.sessionsService.revokeAllForUser(userId);

    await this.emailService.send('password-changed', updatedUser.email, {
      userName: updatedUser.profile.firstName,
      changedAtISO: updatedUser.updatedAt.toISOString(),
    });
  }
}
