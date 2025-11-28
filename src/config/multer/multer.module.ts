import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10,
      },
    }),
  ],
  exports: [MulterModule],
})
export class MulterConfig {}
