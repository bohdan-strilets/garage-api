import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './tokens.service';
import { Token, TokenSchema } from './schemas/token.schema';
import { jwtConfig } from 'src/common/configs/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register(jwtConfig),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
