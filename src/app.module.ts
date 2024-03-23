import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SendgridModule } from './sendgrid/sendgrid.module';
import { CookieModule } from './cookie/cookie.module';
import { ErrorsModule } from './errors/errors.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    TokensModule,
    UsersModule,
    AuthModule,
    CloudinaryModule,
    SendgridModule,
    CookieModule,
    ErrorsModule,
    CarsModule,
  ],
})
export class AppModule {}
