import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { PayloadType } from './types/payload.type';
import { TokensType } from './types/tokens.type';
import { TokensTypeEnum } from './enums/token-type.enum';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
  ) {}

  createPayload(user: UserDocument): PayloadType {
    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActivated: user.isActivated,
    };
    return payload;
  }

  generateToken(
    payload: PayloadType,
    secretKey: string,
    lifetime: string,
  ): string {
    const token = this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: lifetime,
    });
    return token;
  }

  async createTokens(payload: PayloadType): Promise<TokensType> {
    const accessToken = this.generateToken(
      payload,
      process.env.ACCESS_TOKEN_KEY,
      process.env.ACCESS_TOKEN_TIME,
    );
    const refreshToken = this.generateToken(
      payload,
      process.env.REFRESH_TOKEN_KEY,
      process.env.REFRESH_TOKEN_TIME,
    );

    const owner = payload._id;
    const tokens = { accessToken, refreshToken };
    const tokensFromDb = await this.TokenModel.findOne({ owner });

    if (!tokensFromDb) {
      await this.TokenModel.create({ ...tokens, owner });
    }
    if (tokensFromDb) {
      await this.TokenModel.findByIdAndUpdate(tokensFromDb._id, { ...tokens });
    }

    return tokens;
  }

  checkToken(token: string, type: TokensTypeEnum): PayloadType | null {
    let payload: PayloadType;

    if (type === TokensTypeEnum.ACCESS) {
      payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
    } else if (type === TokensTypeEnum.REFRESH) {
      payload = this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    }

    if (payload) {
      return payload;
    } else {
      return null;
    }
  }

  async findTokenFromDb(userId: Types.ObjectId): Promise<TokenDocument | null> {
    const tokens = await this.TokenModel.findOne({ owner: userId });

    if (tokens) {
      return tokens;
    }

    return null;
  }

  async deleteTokensByDb(userId: Types.ObjectId): Promise<void> {
    await this.TokenModel.findOneAndDelete({ owner: userId });
  }
}
