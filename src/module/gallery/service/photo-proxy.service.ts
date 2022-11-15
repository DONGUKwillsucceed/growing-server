import { Injectable } from '@nestjs/common';
import { GetPhotoService } from './get-photo.service';

@Injectable()
export class PhotoProxyService {
  constructor(private readonly getPhotoService: GetPhotoService) {}
  async findMany(coupleId: string) {
    return await this.getPhotoService.findMany(coupleId);
  }
}
