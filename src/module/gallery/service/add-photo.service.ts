import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { AddPhotoDto } from '../dto/AddPhoto.dto';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AddPhotoService {
  constructor(private readonly prismaService: PrismaService) {}

  async add(albumId: string, dto: AddPhotoDto) {
    const { imageIds } = dto;
    for (const imageId of imageIds) {
      this.createAlbums_Photos(
        this.createDataForAlbums_Photos(albumId, imageId),
      );
    }
  }

  async createAlbums_Photos(data: Prisma.Albums_PhotosUncheckedCreateInput) {
    await this.prismaService.albums_Photos.create({ data });
  }

  createDataForAlbums_Photos(albumId: string, photoId: string) {
    const data: Prisma.Albums_PhotosUncheckedCreateInput = {
      albumId,
      photoId,
    };
    return data;
  }
}
