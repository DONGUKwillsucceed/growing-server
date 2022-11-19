import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
@Injectable()
export class RemoveAlbumService {
  constructor(private readonly prismaService: PrismaService) {}

  async remove(albumId: string) {
    await this.prismaService.albums.update({
      where: { id: albumId },
      data: { isDeleted: 1 },
    });
  }
}
