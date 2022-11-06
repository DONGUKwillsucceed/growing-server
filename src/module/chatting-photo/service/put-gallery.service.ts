import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { Where } from '../types/Where.enum';
@Injectable()
export class PutGalleryService {
  constructor(private readonly prismaService: PrismaService) {}

  async putGallery(photoId: string) {
    await this.updateOneWithWhere(photoId);
  }

  async updateOneWithWhere(photoId: string) {
    await this.prismaService.photos.update({
      where: { id: photoId },
      data: { where: Where.Both },
    });
  }
}
