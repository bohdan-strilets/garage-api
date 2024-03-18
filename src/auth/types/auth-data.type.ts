import { TokensType } from 'src/tokens/types/tokens.type';
import { UserDocument } from 'src/users/schemas/user.schema';

export type AuthDataType = {
  user: UserDocument;
  tokens: TokensType;
};
