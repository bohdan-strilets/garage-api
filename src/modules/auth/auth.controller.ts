import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { SessionDocument } from '@modules/sessions/schemas/session.schema';
import { Device } from '@modules/sessions/types/device.type';
import { SafeUser } from '@modules/user/types/safe-user.type';

import { AuthService } from './auth.service';
import { CurrentDevice } from './decorators/current-device.decorator';
import { CurrentSession } from './decorators/current-session.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserId } from './decorators/current-user-id.decorator';
import { Public } from './decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthResponse } from './types/auth-response.type';
import { AuthUser } from './types/auth-user.type';
import { LogoutResponse } from './types/logout-response.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @CurrentDevice() device: Device,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    return await this.authService.register(dto, device, res);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUser() user: any,
    @CurrentDevice() device: Device,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    return await this.authService.loginWithUser(user, device, res);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: AuthUser,
    @CurrentSession() session: SessionDocument,
  ): Promise<AuthResponse> {
    return await this.authService.refresh(res, session, user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: AuthUser,
  ): Promise<LogoutResponse> {
    return await this.authService.logout(res, user);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logoutAll(
    @Res({ passthrough: true }) res: Response,
    @CurrentUserId() userId: string,
  ): Promise<LogoutResponse> {
    return await this.authService.logoutAll(res, userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUserId() userId: string): Promise<SafeUser> {
    return await this.authService.me(userId);
  }
}
