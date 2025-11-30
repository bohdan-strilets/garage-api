import { PartialType } from '@nestjs/mapped-types';

import { CreateCareProductDto } from './create-care-product.dto';

export class UpdateCareProductDto extends PartialType(CreateCareProductDto) {}
