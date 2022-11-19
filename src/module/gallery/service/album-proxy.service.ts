import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from '../dto/CreateAlbum.dto';
import { PatchAlbumDto } from '../dto/PatchAlbum.dto';
import { CreateAlbumService } from './create-album.service';
import { GetAlbumService } from './get-album.service';
import { PatchAlbumService } from './patch-album.service';
@Injectable()
export class AlbumeProxyService {
  constructor(
    private readonly getAlbumService: GetAlbumService,
    private readonly createAlbumService: CreateAlbumService,
    private readonly patchAlbumService: PatchAlbumService,
  ) {}

  async findMany(coupleId: string) {
    return await this.getAlbumService.findMany(coupleId);
  }

  async create(coupleId: string, userId: string, dto: CreateAlbumDto) {
    await this.createAlbumService.create(coupleId, userId, dto);
  }

  async patch(albumId: string, dto: PatchAlbumDto) {
    await this.patchAlbumService.patch(albumId, dto);
  }
}
