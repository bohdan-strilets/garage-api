import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { FileType } from './enums/file-type.emum';
import { CloudinaryConfig } from './configs/cloudinary.config';

@Injectable()
export class CloudinaryService {
  private cloudinary = v2;

  constructor() {
    this.cloudinary.config(CloudinaryConfig);
  }

  async uploadFile(
    file: Express.Multer.File,
    type: FileType,
    path: string,
  ): Promise<string | null> {
    const uploadOptions = { folder: path, resource_type: type };
    const result = await this.cloudinary.uploader.upload(
      file.path,
      uploadOptions,
    );
    if (result) return result.secure_url;
    return null;
  }

  getPublicId(url: string): string {
    const path = url.split('/');
    const filenameWithExtension = path.at(-1).split('.');
    const fileName = filenameWithExtension.slice(0, 1).join();
    const folders = path.slice(7, path.length - 1).join('/');
    const publicId = [folders, fileName].join('/');
    return publicId;
  }

  async deleteFile(path: string, type: FileType): Promise<void> {
    const deleteOptions = { resource_type: type, invalidate: true };
    const publicId = this.getPublicId(path);
    const result = await this.cloudinary.uploader.destroy(
      publicId,
      deleteOptions,
    );
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete file: ${path}`);
    }
  }

  async deleteFolder(folderPath: string): Promise<void> {
    await this.cloudinary.api.delete_folder(folderPath);
  }
}
