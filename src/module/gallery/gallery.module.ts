import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { S3Service } from 'src/service/S3.service';
import { AlbumPhotoController } from './controller/album-photo.controller';
import { GalleryPhotoController } from './controller/gallery-photo.controller';
import { AddPhotoService } from './service/add-photo.service';
import { AlbumeProxyService } from './service/album-proxy.service';
import { CreateAlbumService } from './service/create-album.service';
import { CreatePhotoService } from './service/create-photo.service';
import { GetAlbumService } from './service/get-album.service';
import { GetPhotoService } from './service/get-photo.service';
import { GetUrlService } from './service/get-url.service';
import { PatchAlbumService } from './service/patch-album.service';
import { PhotoProxyService } from './service/photo-proxy.service';
import { PhotoS3Service } from './service/photo-s3.service';
import { RemovePhotoService } from './service/remove-photo.service';

@Module({
  controllers: [GalleryPhotoController, AlbumPhotoController],
  providers: [
    PhotoProxyService,
    GetPhotoService,
    PrismaService,
    PhotoS3Service,
    S3Service,
    GetUrlService,
    CreatePhotoService,
    RemovePhotoService,
    AlbumeProxyService,
    GetAlbumService,
    CreateAlbumService,
    PatchAlbumService,
    AddPhotoService,
  ],
})
export class GalleryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      .forRoutes(GalleryPhotoController, AlbumPhotoController);
  }
}
