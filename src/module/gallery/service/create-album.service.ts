import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from '../dto/CreateAlbum.dto';

@Injectable()
export class CreateAlbumService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(coupleId: string, userId: string, dto: CreateAlbumDto) {
    const { imageIds } = dto;
    const dataForAlbum = this.createDataForAlbum(coupleId, userId, dto);
    const { id } = await this.createAlbum(dataForAlbum);
    for (const imageId of imageIds) {
      this.createAlbums_Photos(this.createDataForAlbums_Photos(id, imageId));
    }
    await this.increaseLoveGaugeForPet(coupleId);
  }

  createDataForAlbum(coupleId: string, userId: string, dto: CreateAlbumDto) {
    const data: Prisma.AlbumsUncheckedCreateInput = {
      id: uuidv4(),
      title: dto.title,
      subHead: dto.subTitle,
      coupleId,
      userId,
    };
    return data;
  }

  async createAlbum(data: Prisma.AlbumsUncheckedCreateInput) {
    return await this.prismaService.albums.create({ data });
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

  async increaseLoveGaugeForPet(coupleId: string) {
    this.prismaService.pets.updateMany({
      where: { coupleId, isDeleted: 0 },
      data: { loveGauge: 2 },
    });
  }
}
