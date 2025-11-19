import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';

import { Response } from 'express';

import { Auth, CurrentUser, CurrentUserId } from '@app/common/decorators';

import { Public } from '../../common/decorators/public.decorator';
import { RefreshCookieService } from '../tokens';

import { AuthService } from './auth.service';
import { Client, Refresh } from './decorators';
import { ChangePasswordDto, EmailDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto';
import { AuthResponse, AuthUser, ClientMeta, RefreshResponse } from './types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: RefreshCookieService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Client() client: ClientMeta,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const { userAgent, device, ip, fingerprint } = client;

    const result = await this.authService.register(dto, userAgent, ip, device, fingerprint);

    this.cookieService.setCookies(result.refreshToken, res);
    return { user: result.user, accessToken: result.accessToken };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Client() client: ClientMeta,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const { userAgent, device, ip, fingerprint } = client;

    const result = await this.authService.login(dto, userAgent, ip, device, fingerprint);

    this.cookieService.setCookies(result.refreshToken, res);
    return { user: result.user, accessToken: result.accessToken };
  }

  @Auth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    const result = await this.authService.logout(user.jti);
    this.cookieService.clearCookies(res);

    return { success: result };
  }

  @Public()
  @Refresh()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: AuthUser,
    @Client() client: ClientMeta,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponse> {
    const { userAgent, device, ip, fingerprint } = client;

    const result = await this.authService.refresh(user.jti, userAgent, ip, device, fingerprint);

    this.cookieService.setCookies(result.refreshToken, res);
    return { accessToken: result.accessToken };
  }

  @Auth()
  @Get('me')
  async me(@CurrentUserId() userId: string) {
    return await this.authService.me(userId);
  }

  @Public()
  @Post('password/forgot')
  @HttpCode(HttpStatus.OK)
  async requestResetPassword(@Body() dto: EmailDto): Promise<void> {
    return await this.authService.requestResetPassword(dto);
  }

  @Public()
  @Post('password/reset/:resetToken')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Param('resetToken') resetToken: string,
  ): Promise<void> {
    return await this.authService.resetPassword(resetToken, dto);
  }

  @Auth()
  @Post('password/change')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUserId() userId: string,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    return await this.authService.changePassword(userId, dto);
  }
}
