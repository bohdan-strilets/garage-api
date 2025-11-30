import { PartialType } from '@nestjs/mapped-types';

import { CreateCareSessionDto } from './create-care-session.dto';

export class UpdateCareSessionDto extends PartialType(CreateCareSessionDto) {}
