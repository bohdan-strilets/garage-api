import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { CryptoService } from '@modules/crypto';
import { PasswordService } from '@modules/password';
import { UserService } from '@modules/user';
import { UserStatus } from '@modules/user/enums/user-status.enum';
import { SafeUser } from '@modules/user/types/safe-user.type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
    private readonly passwordService: PasswordService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<SafeUser> {
    const user = await this.userService.getByEmailForAuth(email);

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.verifyPassword(
      user.security.password.hashedPassword,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userId = user._id.toString();
    return await this.userService.getByIdSafe(userId);
  }
}
