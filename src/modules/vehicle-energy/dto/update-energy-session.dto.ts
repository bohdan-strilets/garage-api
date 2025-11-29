import { PartialType } from '@nestjs/mapped-types';

import { CreateEnergySessionDto } from './create-energy-session.dto';

export class UpdateEnergySessionDto extends PartialType(CreateEnergySessionDto) {}
