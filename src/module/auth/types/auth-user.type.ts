import { UserRole } from 'src/module/user/enums/user-role.enum';

export type AuthUser = {
  sub: string;
  sid: string;
  role: UserRole;
};
