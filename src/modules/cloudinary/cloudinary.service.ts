import { Inject, Injectable, Logger } from '@nestjs/common';

import { v2 as Cloudinary } from 'cloudinary';

import { CloudinaryConfig, cloudinaryConfig } from '@app/config/env/name-space';

import { CloudinaryUploadOptions, CloudinaryUploadResult } from './types';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly rootFolder: string;

  constructor(
    @Inject(cloudinaryConfig.KEY)
    private readonly config: CloudinaryConfig,
  ) {
    Cloudinary.config({
      cloud_name: this.config.cloudName,
      api_key: this.config.apiKey,
      api_secret: this.config.apiSecret,
    });

    this.rootFolder = this.config.rootFolder;
  }

  private buildFolder(parts: string[]): string {
    return [this.rootFolder, ...parts].join('/');
  }

  async uploadImage(
    file: Express.Multer.File,
    folderParts: string[],
    options: CloudinaryUploadOptions = {},
  ): Promise<CloudinaryUploadResult> {
    const folder = this.buildFolder(folderParts);

    return await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = Cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: options.publicId,
          overwrite: options.overwrite ?? true,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            this.logger.error('Cloudinary upload failed', error ?? undefined);
            return reject(error ?? new Error('Cloudinary upload failed'));
          }

          const payload: CloudinaryUploadResult = {
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
          };

          return resolve(payload);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await Cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });
    } catch (error) {
      this.logger.error(`Failed to delete image ${publicId} from Cloudinary`, error as Error);
    }
  }
}
