import { Injectable } from '@nestjs/common';
import { PutGalleryService } from './put-gallery.service';

@Injectable()
export class PhotoChattingProxyService {
  constructor(private readonly putGalleryService: PutGalleryService) {}

  async putGallery(photoId: string) {
    await this.putGalleryService.putGallery(photoId);
  }
}
