import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from 'src/tokens/schemas/token.schema';
import { TokensService } from 'src/tokens/tokens.service';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
    private readonly tokensService: TokensService,
  ) {}
}
