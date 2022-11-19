import { Injectable } from '@nestjs/common';
import { Photos } from '@prisma/client';
import { map } from 'rxjs';
import { Where } from 'src/module/chatting-photo/types/Where.enum';
import { PrismaService } from 'src/service/prisma.service';
import { PhotoDto } from '../dto/Photo.dto';
import { PhotoLineDto } from '../dto/PhotoLine.dto';
import {
  PhotoImageUrlInterface,
  PhotoUserImageUrlInterface,
  PhotoUserInterface,
} from '../types/PhotoInterfaces';
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
      .then((photos) => this.mapFromRelationForPhotoLine(photos));
  }

  async findManyWithAlbumId(albumId: string) {
    return await this.getManyWithAlbumId(albumId)
      .then((photos) => photos.map((photo) => photo.Photos))
      .then((photos) => this.getManyForImageUrl(photos))
      .then((photos) => this.mapFromRelationForPhotoLine(photos));
  }

  async findOne(photoId: string) {
    return await this.getUnique(photoId)
      .then((photo) => this.getOneForImageUrl(photo))
      .then((photo) => this.mapFromRelationForPhoto(photo));
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

  async getManyWithAlbumId(albumId: string) {
    return await this.prismaService.albums_Photos.findMany({
      where: { albumId },
      include: { Photos: true },
    });
  }

  async getUnique(photoId: string) {
    return await this.prismaService.photos.findUnique({
      where: { id: photoId },
      include: {
        Users: true,
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

  async getOneForImageUrl(photo: PhotoUserInterface) {
    const imageUrl = await this.photoS3Service.getSingedUrl(photo.s3Path);
    return { imageUrl, ...photo };
  }

  mapFromRelationForPhotoLine(photos: PhotoImageUrlInterface[]) {
    return photos.map((photo) => {
      const dto: PhotoLineDto = {
        i: photo.id,
        u: photo.imageUrl,
        c: photo.coupleId,
      };
      return dto;
    });
  }

  mapFromRelationForPhoto(photo: PhotoUserImageUrlInterface) {
    const dto: PhotoDto = {
      id: photo.id,
      urls: photo.imageUrl,
      createdAt: photo.createdAt,
      name: photo.Users.nickName,
    };
    return dto;
  }
}
