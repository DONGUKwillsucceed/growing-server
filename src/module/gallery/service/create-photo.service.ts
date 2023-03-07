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
    const data = this.createPhotoData(dto, coupleId, userId);

    return await this.prismaService.photos
      .create({ data })
      .then((photo) => this.mapFromRelation(photo));
  }

  createPhotoData(
    dto: CreatePhotoRequestDto,
    coupleId: string,
    userId: string,
  ) {
    const data: Prisma.PhotosUncheckedCreateInput = {
      s3Path: dto.s3Path,
      where: Where.Gallery,
      type: dto.type,
      coupleId,
      userId,
      id: uuidv4(),
    };
    return data;
  }

  mapFromRelation(photo: Photos) {
    const dto: CreatePhotoResponseDto = {
      photoId: photo.id,
    };
    return dto;
  }
}
