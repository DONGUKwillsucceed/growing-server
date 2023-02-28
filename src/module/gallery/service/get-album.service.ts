import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { PhotoS3Service } from './photo-s3.service';
import { AlbumPhotoInterface } from '../types/AlbumInterface';

@Injectable()
export class GetAlbumService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly photoS3Service: PhotoS3Service,
  ) {}

  async findMany(coupleId: string) {
    return this.getMany(coupleId).then((albums) => this.getImageUrl(albums));
  }

  async getMany(coupleId: string) {
    return this.prismaService.albums.findMany({
      where: { coupleId, isDeleted: 0 },
      include: {
        Albums_Photos: {
          where: { Photos: { isDeleted: 0 } },
          include: {
            Photos: true,
          },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getImageUrl(albums: AlbumPhotoInterface[]) {
    return await Promise.all(
      albums.map(async (album) => {
        let imageUrl = '';
        if (album.Albums_Photos.length > 0) {
          const photo = album.Albums_Photos.filter(
            (ap) => !ap.Photos.isDeleted,
          )[0].Photos;
          const { s3Path } = photo;
          imageUrl = await this.photoS3Service.getSingedUrl(s3Path);
        }

        return { imageUrl, ...album };
      }),
    );
  }
}
