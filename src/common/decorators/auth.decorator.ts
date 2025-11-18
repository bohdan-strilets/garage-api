import { applyDecorators, UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from '../../modules/auth/guards/access-token.guard';

export const Auth = () => applyDecorators(UseGuards(AccessTokenGuard));
