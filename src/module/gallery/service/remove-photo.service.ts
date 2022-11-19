import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
@Injectable()
export class RemovePhotoService {
  constructor(private readonly prismaService: PrismaService) {}

  async remove(photoId: string) {
    await this.prismaService.photos.update({
      where: { id: photoId },
      data: {
        isDeleted: 1,
      },
    });
  }
}
