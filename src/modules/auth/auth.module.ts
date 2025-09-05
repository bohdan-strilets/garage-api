import { Module } from '@nestjs/common';
import { PasswordModule } from '../password/password.module';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionManagerService } from './session-manager.service';

@Module({
  imports: [UserModule, TokenModule, PasswordModule],
  controllers: [AuthController],
  providers: [AuthService, SessionManagerService],
})
export class AuthModule {}
