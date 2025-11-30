import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VehiclesModule } from '../vehicles';

import { CareProductRepository, CareProductsController, CareProductsService } from './product';
import { CareProduct, CareProductSchema } from './product/schemas';
import { CareSessionRepository, CareSessionsController, CareSessionsService } from './sessions';
import { CareSession, CareSessionSchema } from './sessions/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CareProduct.name, schema: CareProductSchema },
      { name: CareSession.name, schema: CareSessionSchema },
    ]),
    VehiclesModule,
  ],
  controllers: [CareProductsController, CareSessionsController],
  providers: [
    CareProductsService,
    CareSessionsService,
    CareProductRepository,
    CareSessionRepository,
  ],
  exports: [CareProductsService, CareSessionsService],
})
export class CarCareModule {}
