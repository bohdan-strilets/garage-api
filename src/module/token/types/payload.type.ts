import { UserRole } from 'src/module/user/enums/user-role.enum';

import { TokensType } from '../enums/tokens-type.enum';

export type Payload = {
  sub: string;
  sid: string;
  role?: UserRole;
  type?: TokensType;
};
