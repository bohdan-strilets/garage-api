import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CryptoModule } from '@modules/crypto';

import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), CryptoModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
