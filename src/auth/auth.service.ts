import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { TokensService } from 'src/tokens/tokens.service';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { RegistrationDto } from './dto/registration.dto';
import { ResponseType } from 'src/common/types/response.type';
import { ResponseTypeEnum } from 'src/common/enums/response-type.enum';
import { AMOUNT_SALT } from 'src/common/vars/vars';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { AuthDataType } from './types/auth-data.type';
import { AVATAR_URL } from 'src/common/vars/vars';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { LoginDto } from './dto/login.dto';
import { TokensTypeEnum } from 'src/tokens/enums/token-type.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly tokensService: TokensService,
    private readonly sendgridService: SendgridService,
  ) {}

  async registration(
    registrationDto: RegistrationDto,
  ): Promise<ResponseType<AuthDataType> | undefined> {
    if (!registrationDto) {
      throw new HttpException(
        {
          status: ResponseTypeEnum.ERROR,
          code: HttpStatus.BAD_REQUEST,
          message: ErrorMessages.CHECK_ENTERED_DATA_CORRECT,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.UserModel.findOne({ email: registrationDto.email });

    if (user) {
      throw new HttpException(
        {
          status: ResponseTypeEnum.ERROR,
          code: HttpStatus.CONFLICT,
          message: ErrorMessages.EMAIL_IN_USE,
        },
        HttpStatus.CONFLICT,
      );
    }

    const activationToken = v4();
    const hashPassword = bcrypt.hashSync(registrationDto.password, bcrypt.genSaltSync(AMOUNT_SALT));

    const newUser = await this.UserModel.create({
      ...registrationDto,
      activationToken,
      avatarUrl: AVATAR_URL,
      password: hashPassword,
    });

    const payload = this.tokensService.createPayload(newUser);
    const tokens = await this.tokensService.createTokens(payload);
    await this.sendgridService.sendConfirmationEmail(newUser.email, newUser.activationToken);

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.CREATED,
      data: {
        user: newUser,
        tokens,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<ResponseType<AuthDataType> | undefined> {
    if (!loginDto) {
      throw new HttpException(
        {
          status: ResponseTypeEnum.ERROR,
          code: HttpStatus.BAD_REQUEST,
          message: ErrorMessages.CHECK_ENTERED_DATA_CORRECT,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.UserModel.findOne({ email: loginDto.email });

    if (!user) {
      throw new HttpException(
        {
          status: ResponseTypeEnum.ERROR,
          code: HttpStatus.BAD_REQUEST,
          message: ErrorMessages.EMAIL_IS_WRONG,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkPassword = bcrypt.compareSync(loginDto.password, user.password);

    if (!checkPassword) {
      throw new HttpException(
        {
          status: ResponseTypeEnum.ERROR,
          code: HttpStatus.BAD_REQUEST,
          message: ErrorMessages.PASSWORD_IS_WRONG,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user.isActivated) {
      throw new HttpException(
        {
          status: ResponseTypeEnum.ERROR,
          code: HttpStatus.BAD_REQUEST,
          message: ErrorMessages.EMAIL_IS_NOT_ACTIVATED,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = this.tokensService.createPayload(user);
    const tokens = await this.tokensService.createTokens(payload);

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
      data: {
        user: user,
        tokens,
      },
    };
  }

  async logout(refreshToken: string): Promise<ResponseType | undefined> {
    if (!refreshToken) {
      throw new HttpException(
        {
          status: ResponseTypeEnum.ERROR,
          code: HttpStatus.UNAUTHORIZED,
          message: ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userData = this.tokensService.checkToken(refreshToken, TokensTypeEnum.REFRESH);
    const tokenFromDb = await this.tokensService.findTokenFromDb(userData._id);

    if (!userData || !tokenFromDb) {
      throw new HttpException(
        {
          status: ResponseTypeEnum.ERROR,
          code: HttpStatus.NOT_FOUND,
          message: ErrorMessages.USER_NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.tokensService.deleteTokensByDb(userData._id);

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
    };
  }
}
