import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { S3Service } from 'src/service/S3.service';
import { PhotoLineDto } from '../dto/PhotoLine.dto';
import {
  ChattingPhotoPhotoType,
  ChattingPhotoType,
  PhotoImageType,
} from '../types/ChattingPhoto.type';
import { Where } from '../types/Where.enum';
@Injectable()
export class GetPhotoChattingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}
  async findMany(coupleId: string, userId: string) {
    return await this.getMany(coupleId, userId)
      .then((cp) => this.getPhotosFromChattingPhotos(cp))
      .then((photo) => this.getImageUrl(photo))
      .then((photo) => this.mapFromRelation(photo));
  }

  getPhotosFromChattingPhotos(cp: ChattingPhotoType[]) {
    return cp.map((cp) => {
      const photos = cp.Chatting_Photo.map((cp) => cp.Photos);
      return { photos, ...cp };
    });
  }

  async getMany(coupleId: string, userId: string) {
    return await this.prismaService.chattings.findMany({
      where: {
        coupleId,
        User_Chatting_IsDeleted: {
          none: {
            userId,
            isDeleted: 1,
          },
        },
        Chatting_Photo: {
          some: {
            Photos: {
              OR: [{ where: Where.Both }, { where: Where.Chatting }],
            },
          },
        },
      },
      include: {
        Chatting_Photo: {
          include: {
            Photos: { include: { VideoStorage: true } },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getImageUrl(photos: ChattingPhotoPhotoType[]) {
    return await Promise.all(
      photos.map(async (photo) => {
        const imageUrls: string[] = [];
        for (const p of photo.Chatting_Photo) {
          const s3Path = p.Photos.s3Path;
          const url = await this.s3Service.getObjectUrl(new URL(s3Path));
          imageUrls.push(url);
        }
        return { imageUrls, ...photo };
      }),
    );
  }

  mapFromRelation(photos: PhotoImageType[]) {
    return photos.map((photo) => {
      let t: number | null = null;

      if (photo.photos[0].VideoStorage) t = photo.photos[0].VideoStorage.time;

      const dto: PhotoLineDto = {
        i: photo.id,
        u: photo.imageUrls,
        c: photo.coupleId,
        t,
      };
      return dto;
    });
  }
}
