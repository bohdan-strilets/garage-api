import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { ErrorsModule } from 'src/errors/errors.module';
import { CookieModule } from 'src/cookie/cookie.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SendgridModule,
    CloudinaryModule,
    TokensModule,
    ErrorsModule,
    CookieModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
