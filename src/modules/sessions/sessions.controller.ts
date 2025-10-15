import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';

import { Auth } from '@modules/auth/decorators/auth.decorator';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { CurrentUserId } from '@modules/auth/decorators/current-user-id.decorator';
import { AuthUser } from '@modules/auth/types/auth-user.type';

import { ListParams, PaginatedResult } from '@common/pagination';

import { SessionDocument } from './schemas/session.schema';
import { SessionsService } from './sessions.service';

@Auth()
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  async findMy(
    @CurrentUserId() userId: string,
    listParams: ListParams,
  ): Promise<PaginatedResult<SessionDocument>> {
    return await this.sessionsService.findMySessions(userId, listParams);
  }

  @Get('current')
  async getByIdOwned(@CurrentUser() user: AuthUser): Promise<SessionDocument> {
    const { sid, sub: userId } = user;
    return await this.sessionsService.getByIdOwned(sid, userId);
  }

  @Delete(':sid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeByIdOwned(@Param('sid') sid: string, @CurrentUserId() userId: string): Promise<void> {
    await this.sessionsService.revoke(sid, userId);
    return;
  }

  @Post('revoke-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeAllOwned(@CurrentUser() user: AuthUser): Promise<void> {
    const { sid, sub: userId } = user;
    await this.sessionsService.revokeOthers(sid, userId);
    return;
  }
}
