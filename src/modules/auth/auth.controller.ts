import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import { Response } from 'express';

import { Auth, CurrentUser, CurrentUserId } from '@app/common/decorators';
import { SuccessMessage } from '@app/common/http/decorators';

import { Public } from '../../common/decorators/public.decorator';
import { RefreshCookieService } from '../tokens';
import { UpdateEmailDto } from '../user/dto';
import { UserSelf } from '../user/types';

import { AuthService } from './auth.service';
import { Client, Refresh } from './decorators';
import { ChangePasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto';
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
  @SuccessMessage('Logout successful')
  async logout(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(user.jti);
    this.cookieService.clearCookies(res);
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
  async me(@CurrentUserId() userId: string): Promise<UserSelf> {
    return await this.authService.me(userId);
  }

  @Public()
  @Post('password/forgot')
  @HttpCode(HttpStatus.OK)
  @SuccessMessage('Password reset request successful')
  async requestResetPassword(@Body() dto: UpdateEmailDto): Promise<void> {
    return await this.authService.requestResetPassword(dto);
  }

  @Public()
  @Post('password/reset/:resetToken')
  @HttpCode(HttpStatus.OK)
  @SuccessMessage('Password reset successful')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Param('resetToken') resetToken: string,
  ): Promise<void> {
    return await this.authService.resetPassword(resetToken, dto);
  }

  @Auth()
  @Post('password/change')
  @HttpCode(HttpStatus.OK)
  @SuccessMessage('Password change successful')
  async changePassword(
    @CurrentUserId() userId: string,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    return await this.authService.changePassword(userId, dto);
  }

  @Public()
  @Get('verify-email')
  @SuccessMessage('Email verification successful')
  async verifyEmail(@Query('token') token: string): Promise<void> {
    return await this.authService.verifyEmail(token);
  }

  @Auth()
  @Post('verify-email/resend')
  @HttpCode(HttpStatus.OK)
  @SuccessMessage('Verification email resent successfully')
  async resendVerificationEmail(@CurrentUserId() userId: string): Promise<void> {
    return await this.authService.resendVerificationEmail(userId);
  }
}
