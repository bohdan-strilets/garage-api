import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

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

@Injectable()
export class AuthService {
  private readonly refreshExpirationDays: number;

  constructor(
    private readonly userService: UserService,
    private readonly sessionsService: SessionsService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly cookieAdapter: CookieAdapter,
  ) {
    this.refreshExpirationDays = parseInt(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_DAYS'),
    );
  }

  async register(dto: RegisterDto, device: Device, res: Response): Promise<AuthResponse> {
    const { email, password } = dto;
    const emailAvailable = await this.userService.isEmailAvailable(email);

    if (!emailAvailable) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await this.passwordService.hashAndValidate(password);
    const userInput: CreateUserInput = { ...dto, hashedPassword };

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
}
