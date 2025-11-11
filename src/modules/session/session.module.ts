import { Module } from '@nestjs/common';

import { SessionController } from './session.controller';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
  exports: [SessionService],
})
export class SessionModule {}
