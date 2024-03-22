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
import { AuthResponseType } from './types/auth-response.type';
import { ResponseType } from 'src/common/types/response.type';
import { CookieService } from 'src/cookie/cookie.service';
import { CookieNamesEnum } from 'src/common/enums/cookie-names.enum';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PathsEnum } from './enums/paths.enum';
import { EndpointsEnum } from 'src/common/enums/endpoints.enum';

@Controller(EndpointsEnum.AUTH_V1)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post(PathsEnum.REGISTRATION)
  async registration(
    @Body() registrationDto: RegistrationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<AuthResponseType> | undefined> {
    const data = await this.authService.registration(registrationDto);
    this.cookieService.createCookie(
      res,
      CookieNamesEnum.REFRESH_TOKEN,
      data.data.tokens.refreshToken,
    );
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post(PathsEnum.LOGIN)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<AuthResponseType> | undefined> {
    const data = await this.authService.login(loginDto);
    this.cookieService.createCookie(
      res,
      CookieNamesEnum.REFRESH_TOKEN,
      data.data.tokens.refreshToken,
    );
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get(PathsEnum.LOGOUT)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType | undefined> {
    const refreshToken = this.cookieService.getCokie(req, CookieNamesEnum.REFRESH_TOKEN);
    const data = await this.authService.logout(refreshToken);
    this.cookieService.deleteCokie(res, CookieNamesEnum.REFRESH_TOKEN);
    return data;
  }

  @Post(PathsEnum.GOOGLE_AUTH)
  async googleAuth(
    @Body('googleToken') googleToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<AuthResponseType> | undefined> {
    const data = await this.authService.googleAuth(googleToken);
    this.cookieService.createCookie(
      res,
      CookieNamesEnum.REFRESH_TOKEN,
      data.data.tokens.refreshToken,
    );
    return data;
  }
}
