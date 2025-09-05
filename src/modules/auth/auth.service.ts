import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { LockedException } from 'src/common/exceptions/locked.exception';
import { sleep } from 'src/common/utils/sleep.util';
import { PasswordService } from '../password/password.service';
import { CookieService } from '../token/cookie.service';
import { SessionRepository } from '../token/session.repository';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { SessionManagerService } from './session-manager.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly maxLoginFails: number;
  private readonly lockMinutes: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
    private readonly sessionRepository: SessionRepository,
    private readonly cookieService: CookieService,
    private readonly sessionManagerService: SessionManagerService,
  ) {
    this.maxLoginFails = this.configService.get<number>('AUTH_MAX_LOGIN_FAILS');
    this.lockMinutes = this.configService.get<number>('AUTH_LOCK_MINUTES');
  }

  async register(dto: CreateUserDto, res: Response, req: Request) {
    const user = await this.userService.createUser(dto);

    const userAgent = req.headers['user-agent'] ?? '';
    const ip = req.ip ?? '';

    const accessToken = await this.sessionManagerService.startSession(
      user._id,
      userAgent,
      ip,
      res,
    );

    return { accessToken, user };
  }

  async login(dto: LoginDto, res: Response, req: Request) {
    const user = await this.userService.getByEmailWithSecret(dto.email);

    if (!user) {
      await sleep(150);
      throw new UnauthorizedException(['invalid credentials']);
    }

    const now = Date.now();
    const userUntil = user.security?.lockedUntil;
    const lockedUntil =
      (userUntil && userUntil instanceof Date && userUntil.getTime()) ?? 0;

    if (lockedUntil > now) {
      throw new LockedException(['account locked, try later']);
    }

    const validPassword = await this.passwordService.verify(
      user.passwordHash,
      dto.password,
    );

    if (!validPassword) {
      const countLocked = await this.userRepository.incLoginFailedCount(
        user._id,
      );

      if (countLocked >= this.maxLoginFails) {
        const lockedDate = new Date(now + this.lockMinutes * 60000);
        await this.userRepository.setLockedUntil(user._id, lockedDate);
        throw new UnauthorizedException(['invalid credentials']);
      }

      await sleep(150);
      throw new UnauthorizedException(['invalid credentials']);
    }

    await this.userRepository.resetLoginFailedCount(user._id);
    await this.userRepository.touchLastLogin(user._id);
    await this.userRepository.setLockedUntil(user._id, null);

    const userAgent = req.headers['user-agent'] ?? '';
    const ip = req.ip ?? '';
    const accessToken = await this.sessionManagerService.startSession(
      user._id,
      userAgent,
      ip,
      res,
    );

    const publicUser = await this.userRepository.findById(user._id);
    return { accessToken, user: publicUser };
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = this.cookieService.getRefresh(req);

    if (!refreshToken) {
      throw new UnauthorizedException(['invalid refresh token']);
    }

    const userAgent = req.headers['user-agent'] ?? '';
    const ip = req.ip ?? '';

    try {
      const accessToken = await this.sessionManagerService.rotateSession(
        refreshToken,
        userAgent,
        ip,
        res,
      );

      return { accessToken };
    } catch (error) {
      this.logger.warn(`Refresh token error: ${error.message}`);
      throw new UnauthorizedException(['invalid refresh token']);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = this.cookieService.getRefresh(req);

      if (!refreshToken) {
        return;
      }

      const payload = await this.tokenService.verifyRefreshToken(refreshToken);

      if (!payload) {
        return;
      }

      await this.sessionRepository.revokeByJti(payload.jti);
      this.cookieService.clearRefresh(res);

      return;
    } catch (error) {
      this.cookieService.clearRefresh(res);
      this.logger.warn(`Logout error: ${error.message}`);
      return;
    }
  }
}
