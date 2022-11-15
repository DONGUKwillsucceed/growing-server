import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { S3Service } from 'src/service/S3.service';
import { GalleryPhotoController } from './controller/gallery-photo.controller';
import { CreatePhotoService } from './service/create-photo.service';
import { GetPhotoService } from './service/get-photo.service';
import { GetUrlService } from './service/get-url.service';
import { PhotoProxyService } from './service/photo-proxy.service';
import { PhotoS3Service } from './service/photo-s3.service';

@Module({
  controllers: [GalleryPhotoController],
  providers: [
    PhotoProxyService,
    GetPhotoService,
    PrismaService,
    PhotoS3Service,
    S3Service,
    GetUrlService,
    CreatePhotoService,
  ],
})
export class GalleryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(GalleryPhotoController);
  }
}
