import { PrismaService } from 'src/service/prisma.service';
import { PatchAlbumDto } from '../dto/PatchAlbum.dto';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PatchAlbumService {
  constructor(private readonly prismaService: PrismaService) {}

  async patch(albumId: string, dto: PatchAlbumDto) {
    await this.prismaService.albums.update({
      where: { id: albumId },
      data: { title: dto.title, subHead: dto.subTitle },
    });
  }
}
