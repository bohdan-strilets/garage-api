import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MulterConfig } from '@app/config/multer';

import { CloudinaryModule } from '../cloudinary';

import { MediaController } from './media.controller';
import { MediaRepository } from './media.repository';
import { MediaService } from './media.service';
import { Image, ImageSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    CloudinaryModule,
    MulterConfig,
  ],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository],
  exports: [MediaService],
})
export class MediaModule {}
