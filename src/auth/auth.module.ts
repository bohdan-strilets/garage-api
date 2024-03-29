import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { TokensModule } from 'src/tokens/tokens.module';
import { JwtStrategy } from './strategys/jwt.strategy';
import { jwtConfig } from 'src/common/configs/jwt.config';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { CookieModule } from 'src/cookie/cookie.module';
import { ErrorsModule } from 'src/errors/errors.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TokensModule,
    JwtModule.register(jwtConfig),
    PassportModule,
    SendgridModule,
    CookieModule,
    ErrorsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
