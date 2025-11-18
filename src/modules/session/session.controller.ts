import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';

import { Auth, CurrentUserId } from '@app/common/decorators';
import { PaginatedResult } from '@app/common/pagination';

import { Session } from './schemas';
import { SessionService } from './session.service';

@Controller('sessions')
@Auth()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async listMySessions(
    @CurrentUserId() userId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<PaginatedResult<Session>> {
    return this.sessionService.listActive(userId, page, limit);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async logoutAll(@CurrentUserId() userId: string): Promise<number> {
    return await this.sessionService.logoutAll(userId);
  }

  @Delete(':sessionId')
  @HttpCode(HttpStatus.OK)
  async revokeById(@Param('sessionId') sessionId: string): Promise<boolean> {
    const session = await this.sessionService.getById(sessionId);
    return await this.sessionService.logoutByJti(session.jti);
  }
}
