import { Injectable } from '@nestjs/common';
import { Photos, Prisma } from '@prisma/client';
import { Where } from 'src/module/chatting-photo/types/Where.enum';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreatePhotoRequestDto } from '../dto/CreatePhotoRequest.dto';
import { CreatePhotoResponseDto } from '../dto/CreatePhotoResponse.dto';

@Injectable()
export class CreatePhotoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreatePhotoRequestDto, coupleId: string, userId: string) {
    let thumbnailPath: string; //

    if (dto.time) {
    }

    let data = this.createPhotoData(thumbnailPath, coupleId, userId);
    let photo = await this.prismaService.photos.create({ data });

    if (dto.time) {
      const video = await this.prismaService.videoStorage.create({
        data: this.createVideoData(dto.s3Path, dto.time, userId, coupleId),
      });

      photo = await this.prismaService.photos.update({
        where: { id: photo.id },
        data: { videoId: video.id },
      });
    }

    return this.mapFromRelation(photo);
  }

  createVideoData(
    s3Path: string,
    time: number,
    userId: string,
    coupleId: string,
  ) {
    const data: Prisma.VideoStorageUncheckedCreateInput = {
      id: uuidv4(),
      userId,
      coupleId,
      s3Path,
      time,
    };
    return data;
  }

  createPhotoData(s3Path: string, coupleId: string, userId: string) {
    const data: Prisma.PhotosUncheckedCreateInput = {
      s3Path: s3Path,
      where: Where.Gallery,
      coupleId,
      userId,
      id: uuidv4(),
    };
    return data;
  }

  mapFromRelation(photo: Photos) {
    const dto: CreatePhotoResponseDto = {
      photoId: photo.id,
      videoId: photo.videoId,
    };
    return dto;
  }
}
