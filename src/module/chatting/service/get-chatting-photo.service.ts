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
        const s3Path = photo.Photos.s3Path;
        const imageUrl = await this.chattingS3Service.getSingedUrl(s3Path);
        return { imageUrl, ...photo };
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
          },
        },
      },
    });
  }

  async mapFromRelation(photos: ChattingPhotoType[]) {
    const id = photos[0].chattingId;
    const createdAt = photos[0].Photos.createdAt;
    const name = photos[0].Photos.Users.nickName;
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
    };
    return photoDto;
  }
}
