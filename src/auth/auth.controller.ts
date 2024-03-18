import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  HttpCode,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { AuthDataType } from './types/auth-data.type';
import { ResponseType } from 'src/common/types/response.type';
import { CookieService } from 'src/cookie/cookie.service';
import { CookieNamesEnum } from 'src/common/enums/cookie-names.enum';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth/v1')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('registration')
  async registration(
    @Body() registrationDto: RegistrationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<AuthDataType> | undefined> {
    const data = await this.authService.registration(registrationDto);
    this.cookieService.createCookie(
      res,
      CookieNamesEnum.REFRESH_TOKEN,
      data.data.tokens.refreshToken,
    );
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<AuthDataType> | undefined> {
    const data = await this.authService.login(loginDto);
    this.cookieService.createCookie(
      res,
      CookieNamesEnum.REFRESH_TOKEN,
      data.data.tokens.refreshToken,
    );
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType | undefined> {
    const refreshToken = this.cookieService.getCokie(req, CookieNamesEnum.REFRESH_TOKEN);
    const data = await this.authService.logout(refreshToken);
    this.cookieService.deleteCokie(res, CookieNamesEnum.REFRESH_TOKEN);
    return data;
  }
}
