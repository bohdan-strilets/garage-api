import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './schemas/session.schema';

import { JwtModule } from '@nestjs/jwt';
import { CookieService } from './cookie.servcie';
import { TokenService } from './token.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    JwtModule.register({}),
  ],
  providers: [TokenService, CookieService],
  exports: [TokenService, CookieService],
})
export class TokenModule {}
