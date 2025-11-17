import { applyDecorators, UseGuards } from '@nestjs/common';

import { RefreshTokenGuard } from '../guards';

export const Refresh = () => applyDecorators(UseGuards(RefreshTokenGuard));
