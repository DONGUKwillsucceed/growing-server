import { Injectable } from '@nestjs/common';
import { Photos } from '@prisma/client';
import { map } from 'rxjs';
import { Where } from 'src/module/chatting-photo/types/Where.enum';
import { PrismaService } from 'src/service/prisma.service';
import { PhotoLineDto } from '../dto/PhotoLine.dto';
import { PhotoImageUrlInterface } from '../types/PhotoInterfaces';
import { PhotoS3Service } from './photo-s3.service';

@Injectable()
export class GetPhotoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly photoS3Service: PhotoS3Service,
  ) {}
  async findMany(coupleId: string) {
    return await this.getMany(coupleId)
      .then((photos) => this.getManyForImageUrl(photos))
      .then((photos) => this.mapFromRelation(photos));
  }

  async getMany(coupleId: string) {
    return await this.prismaService.photos.findMany({
      where: {
        coupleId,
        isDeleted: 0,
        OR: [{ where: Where.Both }, { where: Where.Gallery }],
      },
    });
  }

  async getManyForImageUrl(photos: Photos[]) {
    return await Promise.all(
      photos.map(async (photo) => {
        const imageUrl = await this.photoS3Service.getSingedUrl(photo.s3Path);
        return { imageUrl, ...photo };
      }),
    );
  }

  mapFromRelation(photos: PhotoImageUrlInterface[]) {
    return photos.map((photo) => {
      const dto: PhotoLineDto = {
        i: photo.id,
        u: photo.imageUrl,
        c: photo.coupleId,
      };
      return dto;
    });
  }
}
