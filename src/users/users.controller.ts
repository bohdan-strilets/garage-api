import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseType } from 'src/common/types/response.type';
import { PathsEnum } from './enums/paths.enum';
import { ParamsEnum } from './enums/params.enum';

@Controller('users/v1')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(`${PathsEnum.ACTIVATION_EMAIL}/:${ParamsEnum.ACTIVATION_TOKEN}`)
  async activationEmail(
    @Param(ParamsEnum.ACTIVATION_TOKEN) activationToken: string,
  ): Promise<ResponseType | undefined> {
    const data = await this.usersService.activationEmail(activationToken);
    return data;
  }
}
