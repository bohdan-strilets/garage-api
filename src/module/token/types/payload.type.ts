import { Role } from 'src/module/user/enums/role.enum';

import { TokensType } from '../enums/tokens-type.enum';

export type Payload = {
  sub: string;
  sid: string;
  role?: Role;
  type?: TokensType;
};
