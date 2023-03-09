import { Injectable } from '@nestjs/common';
import { Where } from 'src/module/chatting-photo/types/Where.enum';
import { PrismaService } from 'src/service/prisma.service';
import {
  PhotoUserImageUrlInterface,
  PhotoUserInterface,
  PhotoVideoInterface,
} from '../types/PhotoInterfaces';
import { PhotoS3Service } from './photo-s3.service';

@Injectable()
export class GetPhotoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly photoS3Service: PhotoS3Service,
  ) {}
  async findMany(coupleId: string) {
    return this.getMany(coupleId).then((photos) =>
      this.getManyForImageUrl(photos),
    );
  }

  async findManyWithAlbumId(albumId: string) {
    return this.getManyWithAlbumId(albumId)
      .then((photos) => photos.map((photo) => photo.Photos))
      .then((photos) => this.getManyForImageUrl(photos));
  }

  async findOne(photoId: string) {
    return this.getUnique(photoId)
      .then((photo) => this.getOneForImageUrl(photo))
      .then((photo) => this.getOneForVideoUrl(photo));
  }

  async getMany(coupleId: string) {
    return this.prismaService.photos.findMany({
      where: {
        coupleId,
        isDeleted: 0,
        OR: [{ where: Where.Both }, { where: Where.Gallery }],
      },
      include: { VideoStorage: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getManyWithAlbumId(albumId: string) {
    return this.prismaService.albums_Photos.findMany({
      where: { albumId, Photos: { isDeleted: 0 } },
      include: { Photos: { include: { VideoStorage: true } } },
    });
  }

  async getUnique(photoId: string) {
    return this.prismaService.photos.findUnique({
      where: { id: photoId },
      include: {
        Users: true,
        VideoStorage: true,
      },
    });
  }

  async getManyForImageUrl(photos: PhotoVideoInterface[]) {
    return await Promise.all(
      photos.map(async (photo) => {
        const imageUrl = await this.photoS3Service.getSingedUrl(photo.s3Path);
        return { imageUrl, ...photo };
      }),
    );
  }

  async getOneForImageUrl(photo: PhotoUserInterface) {
    const imageUrl = await this.photoS3Service.getSingedUrl(photo.s3Path);
    return { imageUrl, ...photo };
  }

  async getOneForVideoUrl(photo: PhotoUserImageUrlInterface) {
    let videoUrl: string | null = null;
    if (photo.VideoStorage)
      videoUrl = await this.photoS3Service.getSingedUrl(
        photo.VideoStorage.s3Path,
      );

    return { videoUrl, ...photo };
  }
}
