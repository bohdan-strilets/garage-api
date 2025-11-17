import { applyDecorators, UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from '../guards/access-token.guard';

export const Auth = () => applyDecorators(UseGuards(AccessTokenGuard));
