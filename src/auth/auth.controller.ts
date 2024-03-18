import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { AuthDataType } from './types/auth-data.type';
import { ResponseType } from 'src/common/types/response.type';
import { CookieService } from 'src/cookie/cookie.service';
import { CookieNamesEnum } from 'src/common/enums/cookie-names.enum';

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
}
