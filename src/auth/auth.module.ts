import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Token, TokenSchema } from 'src/tokens/schemas/token.schema';
import { TokensModule } from 'src/tokens/tokens.module';
import { JwtStrategy } from './strategys/jwt.strategy';
import { jwtConfig } from 'src/common/configs/jwt.config';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { CookieModule } from 'src/cookie/cookie.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    TokensModule,
    JwtModule.register(jwtConfig),
    PassportModule,
    SendgridModule,
    CookieModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
