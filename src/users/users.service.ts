import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
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
import { FileType } from 'src/cloudinary/enums/file-type.emum';
import { CloudinaryPathsEnum } from 'src/common/enums/cloudinary-paths.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import { TokensTypeEnum } from 'src/tokens/enums/token-type.enum';
import { AuthResponseType } from 'src/auth/types/auth-response.type';

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

  async uploadAvatar(
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ): Promise<ResponseType<UserDocument> | undefined> {
    const user = await this.UserModel.findById(userId);

    if (!user) {
      this.errorService.showHttpException(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }

    const publicId = this.cloudinaryService.getPublicId(user.avatarUrl);
    const isGoogleAvatar = this.cloudinaryService.isGoogleAvatarUrl(user.avatarUrl);

    if (!isGoogleAvatar) {
      if (!publicId.split('/').includes('default')) {
        await this.cloudinaryService.deleteFile(user.avatarUrl, FileType.IMAGE);
      }
    }

    const avatarPath = `${CloudinaryPathsEnum.USER_AVATAR}${userId}`;
    const resultPath = await this.cloudinaryService.uploadFile(file, FileType.IMAGE, avatarPath);
    fs.unlinkSync(file.path);

    const updatedUser = await this.UserModel.findByIdAndUpdate(
      userId,
      { avatarUrl: resultPath },
      { new: true },
    );

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
      data: updatedUser,
    };
  }

  async chnangePassword(
    changePasswordDto: ChangePasswordDto,
    userId: Types.ObjectId,
  ): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findById(userId);

    if (changePasswordDto.password) {
      const checkPassword = bcrypt.compareSync(changePasswordDto.password, user.password);

      if (!user || !checkPassword) {
        this.errorService.showHttpException(
          HttpStatus.UNAUTHORIZED,
          ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
        );
      }
    }

    const password = bcrypt.hashSync(
      changePasswordDto.newPassword,
      bcrypt.genSaltSync(AMOUNT_SALT),
    );
    await this.UserModel.findByIdAndUpdate(userId, { password });

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
    };
  }

  async deleteProfile(userId: Types.ObjectId): Promise<ResponseType | undefined> {
    if (!userId) {
      this.errorService.showHttpException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
      );
    }

    const user = await this.UserModel.findById(userId);
    const isGoogleAvatar = this.cloudinaryService.isGoogleAvatarUrl(user.avatarUrl);
    await this.UserModel.findByIdAndDelete(userId);
    await this.tokenService.deleteTokensByDb(userId);

    const avatarPublicId = this.cloudinaryService.getPublicId(user.avatarUrl);

    if (!isGoogleAvatar) {
      if (!avatarPublicId.split('/').includes('default')) {
        await this.cloudinaryService.deleteFile(user.avatarUrl, FileType.IMAGE);
        await this.cloudinaryService.deleteFolder(`${CloudinaryPathsEnum.USER_AVATAR}${userId}`);
      }
    }

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
    };
  }

  async refreshUser(refreshToken: string): Promise<ResponseType<AuthResponseType> | undefined> {
    if (!refreshToken) {
      this.errorService.showHttpException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
      );
    }

    const userData = this.tokenService.checkToken(refreshToken, TokensTypeEnum.REFRESH);
    const tokenFromDb = await this.tokenService.findTokenFromDb(userData._id);

    if (!userData || !tokenFromDb) {
      this.errorService.showHttpException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessages.USER_IS_NOT_UNAUTHORIZED,
      );
    }

    const user = await this.UserModel.findById(userData._id);
    const payload = this.tokenService.createPayload(user);
    const tokens = await this.tokenService.createTokens(payload);

    return {
      status: ResponseTypeEnum.SUCCESS,
      code: HttpStatus.OK,
      data: {
        tokens,
      },
    };
  }
}
