import { TokensType } from 'src/tokens/types/tokens.type';
import { UserDocument } from 'src/users/schemas/user.schema';

export type AuthResponseType = {
  user?: UserDocument;
  tokens?: TokensType;
};
