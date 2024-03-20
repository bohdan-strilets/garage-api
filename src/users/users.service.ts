import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { TokensService } from 'src/tokens/tokens.service';
import { User, UserDocument } from './schemas/user.schema';
import { ResponseType } from 'src/common/types/response.type';
import { ErrorsService } from 'src/errors/errors.service';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { ResponseTypeEnum } from 'src/common/enums/response-type.enum';
import { EmailDto } from './dto/email.dto';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { AMOUNT_SALT } from 'src/common/vars/vars';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly sendgridService: SendgridService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly tokenService: TokensService,
    private readonly errorService: ErrorsService,
  ) {}

  async activationEmail(activationToken: string): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ activationToken });

    if (!user) {
      this.errorService.showHttpException(
        HttpStatus.BAD_REQUEST,
        ErrorMessages.ACTIVATION_TOKEN_IS_WRONG,
      );
    }

    await this.UserModel.findByIdAndUpdate(user._id, { activationToken: null, isActivated: true });

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
    };
  }

  async requestRepeatActivationEmail(emailDto: EmailDto): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: emailDto.email });

    if (!user) {
      this.errorService.showHttpException(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }

    const activationToken = v4();
    await this.sendgridService.sendConfirmationEmail(user.email, activationToken);
    await this.UserModel.findByIdAndUpdate(user._id, { isActivated: false, activationToken });

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
    };
  }

  async getCurrentUser(userId: Types.ObjectId): Promise<ResponseType<UserDocument> | undefined> {
    if (!userId) {
      this.errorService.showHttpException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
      );
    }

    const user = await this.UserModel.findById(userId);

    if (!user) {
      this.errorService.showHttpException(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
      data: user,
    };
  }

  async changeProfile(
    userId: Types.ObjectId,
    changeProfileDto: ChangeProfileDto,
  ): Promise<ResponseType<UserDocument> | undefined> {
    if (!userId) {
      this.errorService.showHttpException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
      );
    }

    const updatedUser = await this.UserModel.findByIdAndUpdate(userId, changeProfileDto, {
      new: true,
    });

    if (!updatedUser) {
      this.errorService.showHttpException(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
      data: updatedUser,
    };
  }

  async changeEmail(userId: Types.ObjectId, emailDto: EmailDto): Promise<ResponseType | undefined> {
    if (!userId) {
      this.errorService.showHttpException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
      );
    }

    const activationToken = v4();
    await this.sendgridService.sendConfirmationEmail(emailDto.email, activationToken);
    const dto = { email: emailDto.email, activationToken, isActivated: false };
    await this.UserModel.findByIdAndUpdate(userId, dto, { new: true });

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
    };
  }

  async requestResetPassword(emailDto: EmailDto): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: emailDto.email });

    if (!user) {
      this.errorService.showHttpException(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }

    await this.sendgridService.sendPasswordResetEmail(user.email);

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ResponseType | undefined> {
    const password = bcrypt.hashSync(resetPasswordDto.password, bcrypt.genSaltSync(AMOUNT_SALT));
    const user = await this.UserModel.findOne({ email: resetPasswordDto.email });

    if (!user) {
      this.errorService.showHttpException(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }

    await this.UserModel.findByIdAndUpdate(user._id, { password });

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
    };
  }
}
