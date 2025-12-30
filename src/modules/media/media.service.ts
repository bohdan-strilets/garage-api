import { Injectable, Logger } from '@nestjs/common';

import { imageNotFound, ownerImageOfKindNotFound, ownerImagesNotFound } from '@app/common/errors';
import { objectIdToString } from '@app/common/utils';

import { CloudinaryService } from '../cloudinary';

import { SelectImageDto } from './dto';
import { ImageKind, ImageOwner } from './enums';
import { MediaRepository } from './media.repository';
import { Image } from './schemas';
import { CreateImageInput, ImageCollection, UploadImageInput, UploadManyInput } from './types';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly repository: MediaRepository,
    private readonly cloudinary: CloudinaryService,
  ) {}

  private buildOwnerFolder(ownerType: ImageOwner, ownerId: string, kind: ImageKind): string[] {
    const formattedOwnerType = ownerType.toLowerCase().trim();
    const formattedKind = kind.toLowerCase().trim();
    const formattedOwnerId = objectIdToString(ownerId);

    return [formattedOwnerType, formattedOwnerId, formattedKind];
  }

  private async uploadOne(input: UploadImageInput): Promise<Image> {
    const { file, kind, ownerId, ownerType } = input;
    const formattedOwnerId = objectIdToString(ownerId);

    const folderParts = this.buildOwnerFolder(ownerType, formattedOwnerId, kind);
    const folderPath = folderParts.join('/');

    const uploadResult = await this.cloudinary.uploadImage(file, folderParts);

    const payload: CreateImageInput = {
      ownerId: formattedOwnerId,
      ownerType,
      kind,
      publicId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      folder: folderPath,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
    };

    return await this.repository.create(payload);
  }

  async getById(imageId: string): Promise<Image> {
    const image = await this.repository.findById(imageId);

    if (!image) {
      this.logger.debug(`Image with ID ${imageId} not found`);
      imageNotFound();
    }

    return image;
  }

  async getManyByOwner(ownerId: string, ownerType: ImageOwner, kind?: ImageKind): Promise<Image[]> {
    return await this.repository.findManyByOwner(ownerId, ownerType, kind);
  }

  async getOneByOwner(ownerId: string, ownerType: ImageOwner, kind: ImageKind): Promise<Image> {
    const image = await this.repository.findOneByOwner(ownerId, ownerType, kind);

    if (!image) {
      this.logger.debug(`Image with ownerId ${ownerId} not found`);
      imageNotFound();
    }

    return image;
  }

  async getCollection(
    ownerId: string,
    ownerType: ImageOwner,
    kind: ImageKind,
  ): Promise<ImageCollection> {
    const images = await this.repository.findManyByOwner(ownerId, ownerType, kind);

    if (!images.length) {
      return { resources: [], selected: null };
    }

    const selected = images.find((img) => img.isSelected) ?? null;
    return { resources: images, selected };
  }

  async uploadImage(input: UploadImageInput): Promise<Image> {
    const image = await this.uploadOne(input);
    const formattedImageId = objectIdToString(image._id);

    if (input.select) {
      const selectPayload: SelectImageDto = {
        ownerId: input.ownerId,
        ownerType: input.ownerType,
        kind: input.kind,
        imageId: formattedImageId,
      };

      await this.selectImage(selectPayload);
      image.isSelected = true;
    }

    return image;
  }

  async uploadMany(input: UploadManyInput): Promise<Image[]> {
    const { ownerId, ownerType, kind, files, selectFirst } = input;
    const results: Image[] = [];

    for (const file of files) {
      const input: UploadImageInput = { ownerId, ownerType, kind, file };
      const image = await this.uploadOne(input);
      results.push(image);
    }

    if (selectFirst && results.length > 0) {
      const first = results[0];
      const formattedImageId = objectIdToString(first._id);

      const selectPayload: SelectImageDto = {
        ownerId,
        ownerType,
        kind,
        imageId: formattedImageId,
      };

      await this.selectImage(selectPayload);
      first.isSelected = true;
    }

    return results;
  }

  async selectImage(dto: SelectImageDto): Promise<boolean> {
    const { ownerId, ownerType, kind, imageId } = dto;
    const images = await this.repository.findManyByOwner(ownerId, ownerType, kind);

    if (!images.length) {
      ownerImagesNotFound();
    }

    const targetId = objectIdToString(imageId);
    const targetImage = images.find((img) => objectIdToString(img._id) === targetId);

    if (!targetImage) {
      ownerImageOfKindNotFound();
    }

    await this.repository.updateManyByIds(
      images.map((img) => objectIdToString(img._id)),
      { isSelected: false },
    );

    return await this.repository.updateById(objectIdToString(targetImage._id), {
      isSelected: true,
    });
  }

  async deleteImage(imageId: string): Promise<boolean> {
    const image = await this.getById(imageId);

    const ownerId = objectIdToString(image.ownerId);
    const ownerType = image.ownerType;
    const kind = image.kind;
    const wasSelected = image.isSelected;

    await this.cloudinary.deleteImage(image.publicId);
    const deleted = await this.repository.softDeleteById(imageId);

    if (wasSelected) {
      const remaining = await this.repository.findManyByOwner(ownerId, ownerType, kind);

      if (remaining.length > 0) {
        const first = remaining[0];
        await this.repository.updateById(objectIdToString(first._id), { isSelected: true });
      }
    }

    return deleted;
  }
}
