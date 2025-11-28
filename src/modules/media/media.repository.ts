import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { getNow, objectIdToString } from '@app/common/utils';

import { ImageKind, ImageOwner } from './enums';
import { Image, ImageDocument } from './schemas';
import { CreateImageInput } from './types';

@Injectable()
export class MediaRepository {
  constructor(
    @InjectModel(Image.name)
    private readonly model: Model<ImageDocument>,
  ) {}

  async create(input: CreateImageInput): Promise<Image> {
    return await this.model.create(input);
  }

  async findById(imageId: string): Promise<Image | null> {
    const formattedImageId = objectIdToString(imageId);
    return await this.model.findById(formattedImageId).exec();
  }

  async findManyByOwner(
    ownerId: string,
    ownerType: ImageOwner,
    kind?: ImageKind,
  ): Promise<Image[]> {
    const formattedOwnerId = objectIdToString(ownerId);

    const filter: FilterQuery<ImageDocument> = {
      ownerId: formattedOwnerId,
      ownerType,
      isDeleted: false,
    };

    if (kind) {
      filter.kind = kind;
    }

    return await this.model.find(filter).exec();
  }

  async findOneByOwner(
    ownerId: string,
    ownerType: ImageOwner,
    kind: ImageKind,
  ): Promise<Image | null> {
    const formattedOwnerId = objectIdToString(ownerId);

    const filter: FilterQuery<ImageDocument> = {
      ownerId: formattedOwnerId,
      ownerType,
      kind,
      isDeleted: false,
    };

    return await this.model.findOne(filter).exec();
  }

  async softDeleteById(imageId: string): Promise<boolean> {
    const formattedImageId = objectIdToString(imageId);
    const now = getNow();

    const filter: FilterQuery<ImageDocument> = { _id: formattedImageId };
    const update: UpdateQuery<ImageDocument> = {
      isDeleted: true,
      deletedAt: now,
      isSelected: false,
    };

    const result = await this.model.updateOne(filter, update).exec();
    return result.modifiedCount > 0;
  }

  async softDeleteByOwner(
    ownerId: string,
    ownerType: ImageOwner,
    kind?: ImageKind,
  ): Promise<boolean> {
    const formattedOwnerId = objectIdToString(ownerId);
    const now = getNow();

    const filter: FilterQuery<ImageDocument> = {
      ownerId: formattedOwnerId,
      ownerType,
      isDeleted: false,
    };

    if (kind) {
      filter.kind = kind;
    }

    const update: UpdateQuery<ImageDocument> = {
      isDeleted: true,
      deletedAt: now,
      isSelected: false,
    };

    const result = await this.model.updateMany(filter, update).exec();
    return result.modifiedCount > 0;
  }

  async updateById(imageId: string, update: UpdateQuery<ImageDocument>): Promise<boolean> {
    const formattedImageId = objectIdToString(imageId);
    const filter: FilterQuery<ImageDocument> = { _id: formattedImageId };

    const result = await this.model.updateOne(filter, update).exec();
    return result.modifiedCount > 0;
  }

  async updateManyByIds(imageIds: string[], update: UpdateQuery<ImageDocument>): Promise<number> {
    const formattedIds = imageIds.map((id) => objectIdToString(id));
    const filter: FilterQuery<ImageDocument> = { _id: { $in: formattedIds } };

    const result = await this.model.updateMany(filter, update).exec();
    return result.modifiedCount;
  }
}
