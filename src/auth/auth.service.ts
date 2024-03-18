import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Token, TokenDocument } from 'src/tokens/schemas/token.schema';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
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
}
