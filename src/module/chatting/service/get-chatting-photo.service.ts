import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { PhotoDto } from '../dto/Photo.dto';
import {
  ChattingPhotoType,
  ChattingType,
} from '../types/ChattingPhoto.interface';
import { ChattingS3Service } from './chatting-s3.service';

@Injectable()
export class GetChattingPhotoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly chattingS3Service: ChattingS3Service,
  ) {}

  async findOneForPhotoDto(chattingId: string) {
    return await this.getOneForPhoto(chattingId)
      .then((photo) => this.getManyForImageUrl(photo))
      .then((photo) => this.mapFromRelation(photo));
  }

  async getManyForImageUrl(photos: ChattingType[]) {
    return await Promise.all(
      photos.map(async (photo) => {
        if (!photo.Photos.VideoStorage) {
          const s3Path = photo.Photos.s3Path;
          const imageUrl = await this.chattingS3Service.getSingedUrl(s3Path);
          return { imageUrl, ...photo, video: null };
        } else {
          const { VideoStorage } = photo.Photos;
          const thumbnailUrl = await this.chattingS3Service.getSingedUrl(
            photo.Photos.s3Path,
          );
          const videoUrl = await this.chattingS3Service.getSingedUrl(
            VideoStorage.s3Path,
          );
          const video = {
            thumbnailUrl,
            videoUrl,
            time: VideoStorage.time,
            id: VideoStorage.id,
          };
          return { video, imageUrl: null, ...photo };
        }
      }),
    );
  }

  async getOneForPhoto(chattingId: string) {
    return await this.prismaService.chatting_Photo.findMany({
      where: { chattingId },
      include: {
        Photos: {
          include: {
            Users: true,
            VideoStorage: true,
          },
        },
      },
    });
  }

  async mapFromRelation(photos: ChattingPhotoType[]) {
    const id = photos[0].chattingId;
    const createdAt = photos[0].Photos.createdAt;
    const name = photos[0].Photos.Users.nickName;
    if (photos[0].video) {
      const photoDto: PhotoDto = {
        id,
        createdAt,
        name,
        photos: null,
        video: photos[0].video,
      };
      return photoDto;
    } else {
      const photoType = photos.map((photo) => {
        return {
          id: photo.Photos.id,
          url: photo.imageUrl,
        };
      });

      const photoDto: PhotoDto = {
        id,
        createdAt,
        name,
        photos: photoType,
        video: null,
      };
      return photoDto;
    }
  }
}
