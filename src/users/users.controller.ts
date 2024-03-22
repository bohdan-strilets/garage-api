import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { ResponseType } from 'src/common/types/response.type';
import { PathsEnum } from './enums/paths.enum';
import { ParamsEnum } from './enums/params.enum';
import { EmailDto } from './dto/email.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PayloadType } from 'src/tokens/types/payload.type';
import { UserDocument } from './schemas/user.schema';
import { AuthRequestType } from 'src/common/types/auth-request.type';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidator } from './pipes/image-validator.pipe';
import { DEFAULT_FOLDER_FOR_FILES } from 'src/common/vars/vars';
import { FileNamesEnum } from 'src/common/types/file-names.type';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CookieService } from 'src/cookie/cookie.service';
import { CookieNamesEnum } from 'src/common/enums/cookie-names.enum';
import { AuthResponseType } from 'src/auth/types/auth-response.type';
import { EndpointsEnum } from 'src/common/enums/endpoints.enum';

@Controller(EndpointsEnum.USERS_V1)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cookieService: CookieService,
  ) {}

  @Get(`${PathsEnum.ACTIVATION_EMAIL}/:${ParamsEnum.ACTIVATION_TOKEN}`)
  async activationEmail(
    @Param(ParamsEnum.ACTIVATION_TOKEN) activationToken: string,
  ): Promise<ResponseType | undefined> {
    const data = await this.usersService.activationEmail(activationToken);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post(PathsEnum.REQUEST_REPEAT_ACTIVATION_EMAIL)
  async requestRepeatActivationEmail(
    @Body() emailDto: EmailDto,
  ): Promise<ResponseType | undefined> {
    const data = await this.usersService.requestRepeatActivationEmail(emailDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get(PathsEnum.CURRENT_USER)
  async getCurrentUser(
    @Req() req: AuthRequestType<PayloadType>,
  ): Promise<ResponseType<UserDocument> | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.getCurrentUser(_id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(PathsEnum.CHANGE_PROFILE)
  async changeProfile(
    @Body() changeProfileDto: ChangeProfileDto,
    @Req() req: AuthRequestType<PayloadType>,
  ): Promise<ResponseType<UserDocument> | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.changeProfile(_id, changeProfileDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(PathsEnum.CHANGE_EMAIL)
  async changeEmail(
    @Body() emailDto: EmailDto,
    @Req() req: AuthRequestType<PayloadType>,
  ): Promise<ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.changeEmail(_id, emailDto);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post(PathsEnum.REQUEST_RESET_PASSWORD)
  async requestResetPassword(@Body() emailDto: EmailDto): Promise<ResponseType | undefined> {
    const data = await this.usersService.requestResetPassword(emailDto);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post(PathsEnum.RESET_PASSWORD)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseType | undefined> {
    const data = await this.usersService.resetPassword(resetPasswordDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post(PathsEnum.UPLOAD_AVATAR)
  @UseInterceptors(FileInterceptor(FileNamesEnum.AVATAR, { dest: DEFAULT_FOLDER_FOR_FILES }))
  async uploadAvatar(
    @UploadedFile(imageValidator)
    file: Express.Multer.File,
    @Req() req: AuthRequestType<PayloadType>,
  ): Promise<ResponseType<UserDocument> | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.uploadAvatar(file, _id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(PathsEnum.CHANGE_PASSWORD)
  async chnangePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: AuthRequestType<PayloadType>,
  ): Promise<ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.chnangePassword(changePasswordDto, _id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(PathsEnum.DELETE_PROFILE)
  async deleteProfile(
    @Req() req: AuthRequestType<PayloadType>,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.deleteProfile(_id);
    this.cookieService.deleteCokie(res, CookieNamesEnum.REFRESH_TOKEN);
    return data;
  }

  @Get(PathsEnum.REFRESH_USER)
  async refreshUser(
    @Req() req: AuthRequestType<PayloadType>,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<AuthResponseType> | undefined> {
    const refreshToken = this.cookieService.getCokie(req, CookieNamesEnum.REFRESH_TOKEN);
    const data = await this.usersService.refreshUser(refreshToken);
    this.cookieService.createCookie(
      res,
      CookieNamesEnum.REFRESH_TOKEN,
      data.data.tokens.refreshToken,
    );
    return data;
  }
}
