import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Session, SessionSchema } from './schemas/session.schema';
import { SessionRepository } from './session.repository';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
  controllers: [SessionsController],
  providers: [SessionsService, SessionRepository],
  exports: [SessionsService],
})
export class SessionsModule {}
