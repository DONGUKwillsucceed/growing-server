import { Injectable } from '@nestjs/common';
import { GetAlbumService } from './get-album.service';
import { GetPhotoService } from './get-photo.service';
@Injectable()
export class AlbumeProxyService {
  constructor(private readonly getAlbumService: GetAlbumService) {}

  async findMany(coupleId: string) {
    return await this.getAlbumService.findMany(coupleId);
  }
}
