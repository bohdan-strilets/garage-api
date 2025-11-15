import { Module } from '@nestjs/common';

import { CryptoModule } from '../crypto';

import { PasswordService } from './password.service';
import { PasswordPolicyService } from './password-policy.service';
import { PasswordPolicyConstraint } from './validators';

@Module({
  imports: [CryptoModule],
  providers: [PasswordService, PasswordPolicyService, PasswordPolicyConstraint],
  exports: [PasswordService],
})
export class PasswordModule {}
