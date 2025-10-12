import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { SessionDocument } from '@modules/sessions/schemas/session.schema';
import { Device } from '@modules/sessions/types/device.type';

import { AuthService } from './auth.service';
import { CurrentDevice } from './decorators/current-device.decorator';
import { CurrentSession } from './decorators/current-session.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthResponse } from './types/auth-response.type';
import { AuthUser } from './types/auth-user.type';

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
}
