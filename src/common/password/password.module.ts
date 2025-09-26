import { Module } from '@nestjs/common';

import { HashModule } from '../hash/hash.module';

import { PasswordService } from './password.service';

@Module({
  imports: [HashModule],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
