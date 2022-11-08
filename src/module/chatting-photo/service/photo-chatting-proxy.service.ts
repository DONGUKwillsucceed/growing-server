import { Injectable } from '@nestjs/common';
import { GetUrlService } from './get-url.service';
import { PutGalleryService } from './put-gallery.service';

@Injectable()
export class PhotoChattingProxyService {
  constructor(
    private readonly putGalleryService: PutGalleryService,
    private readonly getUrlService: GetUrlService,
  ) {}

  async putGallery(photoId: string) {
    await this.putGalleryService.putGallery(photoId);
  }

  async findOneForDownloadUrl(photoId: string) {
    return await this.getUrlService.getOneForDownloadUrl(photoId);
  }

  async findOneForUploadUrl(coupleId: string, name: string) {
    return await this.getUrlService.getOneForUploadUrl(coupleId, name);
  }
}
