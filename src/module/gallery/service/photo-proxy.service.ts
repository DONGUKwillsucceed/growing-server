import { Injectable } from '@nestjs/common';
import { CreatePhotoRequestDto } from '../dto/CreatePhotoRequest.dto';
import { CreatePhotoService } from './create-photo.service';
import { GetPhotoService } from './get-photo.service';
import { GetUrlService } from './get-url.service';
import { RemovePhotoService } from './remove-photo.service';

@Injectable()
export class PhotoProxyService {
  constructor(
    private readonly getPhotoService: GetPhotoService,
    private readonly getUrlService: GetUrlService,
    private readonly createPhotoService: CreatePhotoService,
    private readonly removePhotoService: RemovePhotoService,
  ) {}

  async findMany(coupleId: string, base: number, take: number) {
    return this.getPhotoService.findMany(coupleId, base, take);
  }

  async findManyWithAlbumId(albumId: string, base: number, take: number) {
    return this.getPhotoService.findManyWithAlbumId(albumId, base, take);
  }

  async findOne(photoId: string) {
    return this.getPhotoService.findOne(photoId);
  }

  async findOneForUploadUrl(coupleId: string, name: string) {
    return this.getUrlService.getOneForUploadUrl(coupleId, name);
  }

  async findOneForDownloadUrl(photoId: string) {
    return this.getUrlService.getOneForDownloadUrl(photoId);
  }

  async create(dto: CreatePhotoRequestDto, coupleId: string, userId: string) {
    return this.createPhotoService.create(dto, coupleId, userId);
  }

  async remove(photoId: string) {
    this.removePhotoService.remove(photoId);
  }
}
