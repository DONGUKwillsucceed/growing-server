import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { PhotoS3Service } from './photo-s3.service';
import { AlbumDto } from '../dto/Album.dto';
import {
  AlbumPhotoImageUrlInterface,
  AlbumPhotoInterface,
} from '../types/AlbumInterface';

@Injectable()
export class GetAlbumService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly photoS3Service: PhotoS3Service,
  ) {}

  async findMany(coupleId: string) {
    return await this.getMany(coupleId)
      .then((albums) => this.getImageUrl(albums))
      .then((albums) => this.mapFromRelation(albums));
  }

  async getMany(coupleId: string) {
    return await this.prismaService.albums.findMany({
      where: { coupleId },
      include: {
        Albums_Photos: {
          include: {
            Photos: true,
          },
          take: 1,
        },
      },
    });
  }

  async getImageUrl(albums: AlbumPhotoInterface[]) {
    return await Promise.all(
      albums.map(async (album) => {
        let imageUrl = '';
        if (album.Albums_Photos.length > 0) {
          const photo = album.Albums_Photos[0].Photos;
          const { s3Path } = photo;
          imageUrl = await this.photoS3Service.getSingedUrl(s3Path);
        }

        return { imageUrl, ...album };
      }),
    );
  }

  mapFromRelation(albums: AlbumPhotoImageUrlInterface[]) {
    return albums.map((album) => {
      const dto: AlbumDto = {
        id: album.id,
        imageUrl: album.imageUrl,
        createdAt: album.createdAt,
        title: album.title,
        subTitle: album.subHead,
      };
      return dto;
    });
  }
}
