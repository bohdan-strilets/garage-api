import { UserRole } from '@modules/user/enums/user-role.enum';

export type AuthUser = {
  sub: string;
  sid: string;
  role: UserRole;
};
