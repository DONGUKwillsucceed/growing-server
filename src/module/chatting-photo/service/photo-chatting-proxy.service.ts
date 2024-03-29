import { Injectable } from '@nestjs/common';
import { CreatePhotoRequestDto } from '../dto/CreatePhotoRequest.dto';
import { CreatePhotoService } from './create-photo.service';
import { GetPhotoChattingService } from './get-photo-chatting.service';
import { GetUrlService } from './get-url.service';
import { PutGalleryService } from './put-gallery.service';

@Injectable()
export class PhotoChattingProxyService {
  constructor(
    private readonly putGalleryService: PutGalleryService,
    private readonly getUrlService: GetUrlService,
    private readonly createPhotoService: CreatePhotoService,
    private readonly getPhotoChattingService: GetPhotoChattingService,
  ) {}

  async findMany(
    coupleId: string,
    userId: string,
    base: number,
    limit: number,
  ) {
    return await this.getPhotoChattingService.findMany(
      coupleId,
      userId,
      base,
      limit,
    );
  }

  async putGallery(photoId: string) {
    await this.putGalleryService.putGallery(photoId);
  }

  async findOneForDownloadUrl(photoId: string) {
    return await this.getUrlService.getOneForDownloadUrl(photoId);
  }

  async findOneForUploadUrl(coupleId: string, name: string) {
    return await this.getUrlService.getOneForUploadUrl(coupleId, name);
  }

  async create(dto: CreatePhotoRequestDto, coupleId: string, userId: string) {
    return await this.createPhotoService.create(dto, coupleId, userId);
  }
}
