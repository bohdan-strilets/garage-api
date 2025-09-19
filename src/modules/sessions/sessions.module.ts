import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HashModule } from '../hash/hash.module';

import { Session, SessionSchema } from './schemas/session.schema';
import { SessionRepository } from './session.repository';
import { SessionsService } from './sessions.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    HashModule,
  ],
  providers: [SessionsService, SessionRepository],
  exports: [SessionsService],
})
export class SessionsModule {}
