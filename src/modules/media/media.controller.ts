import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { Auth } from '@app/common/decorators';
import { SuccessMessage } from '@app/common/http/decorators';

import { SelectImageDto, UploadDto } from './dto';
import { ImageKind, ImageOwner } from './enums';
import { MediaService } from './media.service';
import { Image } from './schemas';
import { ImageCollection } from './types';

@Auth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadOne(
    @Body() dto: UploadDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Image> {
    return await this.mediaService.uploadImage({ ...dto, file });
  }

  @Post('upload/many')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMany(
    @Body() dto: UploadDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Image[]> {
    return await this.mediaService.uploadMany({ ...dto, files });
  }

  @Get()
  async getByOwner(
    @Query('ownerId') ownerId: string,
    @Query('ownerType', new ParseEnumPipe(ImageOwner)) ownerType: ImageOwner,
    @Query('kind') kind?: ImageKind,
  ): Promise<Image[]> {
    return await this.mediaService.getManyByOwner(ownerId, ownerType, kind);
  }

  @Get('collection')
  async getCollection(
    @Query('ownerId') ownerId: string,
    @Query('ownerType', new ParseEnumPipe(ImageOwner)) ownerType: ImageOwner,
    @Query('kind', new ParseEnumPipe(ImageKind)) kind: ImageKind,
  ): Promise<ImageCollection> {
    return await this.mediaService.getCollection(ownerId, ownerType, kind);
  }

  @Patch('select')
  @SuccessMessage('Image selected successfully')
  async selectImage(@Body() dto: SelectImageDto): Promise<void> {
    await this.mediaService.selectImage(dto);
  }

  @Delete(':imageId')
  @SuccessMessage('Image deleted successfully')
  async deleteImage(@Param('imageId') imageId: string): Promise<void> {
    await this.mediaService.deleteImage(imageId);
  }
}
