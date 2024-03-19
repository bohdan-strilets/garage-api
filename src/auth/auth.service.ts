import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
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
import { ErrorsService } from 'src/errors/errors.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly tokensService: TokensService,
    private readonly sendgridService: SendgridService,
    private readonly errorService: ErrorsService,
  ) {}

  async registration(
    registrationDto: RegistrationDto,
  ): Promise<ResponseType<AuthDataType> | undefined> {
    if (!registrationDto) {
      this.errorService.showHttpException(
        HttpStatus.BAD_REQUEST,
        ErrorMessages.CHECK_ENTERED_DATA_CORRECT,
      );
    }

    const user = await this.UserModel.findOne({ email: registrationDto.email });

    if (user) {
      this.errorService.showHttpException(HttpStatus.CONFLICT, ErrorMessages.EMAIL_IN_USE);
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
      this.errorService.showHttpException(
        HttpStatus.BAD_REQUEST,
        ErrorMessages.CHECK_ENTERED_DATA_CORRECT,
      );
    }

    const user = await this.UserModel.findOne({ email: loginDto.email });

    if (!user) {
      this.errorService.showHttpException(HttpStatus.BAD_REQUEST, ErrorMessages.EMAIL_IS_WRONG);
    }

    const checkPassword = bcrypt.compareSync(loginDto.password, user.password);

    if (!checkPassword) {
      this.errorService.showHttpException(HttpStatus.BAD_REQUEST, ErrorMessages.PASSWORD_IS_WRONG);
    }

    if (!user.isActivated) {
      this.errorService.showHttpException(
        HttpStatus.BAD_REQUEST,
        ErrorMessages.EMAIL_IS_NOT_ACTIVATED,
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
      this.errorService.showHttpException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
      );
    }

    const userData = this.tokensService.checkToken(refreshToken, TokensTypeEnum.REFRESH);
    const tokenFromDb = await this.tokensService.findTokenFromDb(userData._id);

    if (!userData || !tokenFromDb) {
      this.errorService.showHttpException(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }

    await this.tokensService.deleteTokensByDb(userData._id);

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
    };
  }

  async googleAuth(googleToken: string): Promise<ResponseType<AuthDataType> | undefined> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googlePayload = ticket.getPayload();
    const email = googlePayload.email;
    const userFromDB = await this.UserModel.findOne({ email });

    if (userFromDB) {
      const payload = this.tokensService.createPayload(userFromDB);
      const tokens = await this.tokensService.createTokens(payload);

      return {
        status: ResponseTypeEnum.SUCCESS,
        code: HttpStatus.OK,
        data: {
          user: userFromDB,
          tokens,
        },
      };
    } else {
      const newUser = {
        firstName: googlePayload.given_name,
        lastName: googlePayload.family_name,
        email,
        avatarUrl: googlePayload.picture,
        isActivated: googlePayload.email_verified,
      };
      const createdUser = await this.UserModel.create({ ...newUser });
      const payload = this.tokensService.createPayload(createdUser);
      const tokens = await this.tokensService.createTokens(payload);

      return {
        status: ResponseTypeEnum.SUCCESS,
        code: HttpStatus.CREATED,
        data: {
          user: createdUser,
          tokens,
        },
      };
    }
  }
}
