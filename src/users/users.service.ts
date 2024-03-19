import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { TokensService } from 'src/tokens/tokens.service';
import { User, UserDocument } from './schemas/user.schema';
import { ResponseType } from 'src/common/types/response.type';
import { ErrorsService } from 'src/errors/errors.service';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { ResponseTypeEnum } from 'src/common/enums/response-type.enum';
import { EmailDto } from './dto/email.dto';

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

  async repeatActivationEmail(emailDto: EmailDto): Promise<ResponseType | undefined> {
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
}
