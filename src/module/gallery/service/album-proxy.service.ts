import { Injectable } from '@nestjs/common';
import { AddPhotoDto } from '../dto/AddPhoto.dto';
import { CreateAlbumDto } from '../dto/CreateAlbum.dto';
import { PatchAlbumDto } from '../dto/PatchAlbum.dto';
import { AddPhotoService } from './add-photo.service';
import { CreateAlbumService } from './create-album.service';
import { GetAlbumService } from './get-album.service';
import { PatchAlbumService } from './patch-album.service';
import { RemoveAlbumService } from './remove-album.service';
import { RemovePhotoService } from './remove-photo.service';
@Injectable()
export class AlbumeProxyService {
  constructor(
    private readonly getAlbumService: GetAlbumService,
    private readonly createAlbumService: CreateAlbumService,
    private readonly patchAlbumService: PatchAlbumService,
    private readonly addPhotoService: AddPhotoService,
    private readonly removeAlbumService: RemoveAlbumService,
    private readonly removePhotoService: RemovePhotoService,
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

  async addPhoto(albumId: string, dto: AddPhotoDto) {
    await this.addPhotoService.add(albumId, dto);
  }
  async remove(albumId: string) {
    await this.removeAlbumService.remove(albumId);
  }

  async removePhoto(albumId: string, photoId: string) {
    await this.removePhotoService.removeFromAlbum(albumId, photoId);
  }
}
