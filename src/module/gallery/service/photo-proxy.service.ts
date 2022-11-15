import { Injectable } from '@nestjs/common';
import { CreatePhotoRequestDto } from '../dto/CreatePhotoRequest.dto';
import { CreatePhotoService } from './create-photo.service';
import { GetPhotoService } from './get-photo.service';
import { GetUrlService } from './get-url.service';

@Injectable()
export class PhotoProxyService {
  constructor(
    private readonly getPhotoService: GetPhotoService,
    private readonly getUrlService: GetUrlService,
    private readonly createPhotoService: CreatePhotoService,
  ) {}

  async findMany(coupleId: string) {
    return await this.getPhotoService.findMany(coupleId);
  }

  async findOneForUploadUrl(coupleId: string, name: string) {
    return await this.getUrlService.getOneForUploadUrl(coupleId, name);
  }

  async findOneForDownloadUrl(photoId: string) {
    return await this.getUrlService.getOneForDownloadUrl(photoId);
  }

  async create(dto: CreatePhotoRequestDto, coupleId: string, userId: string) {
    return await this.createPhotoService.create(dto, coupleId, userId);
  }
}
