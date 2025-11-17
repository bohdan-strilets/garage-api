import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CryptoModule } from '../crypto';

import { Session, SessionSchema } from './schemas';
import { SessionController } from './session.controller';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    CryptoModule,
  ],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
  exports: [SessionService],
})
export class SessionModule {}
