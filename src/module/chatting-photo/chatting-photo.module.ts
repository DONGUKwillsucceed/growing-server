import { MiddlewareConsumer, Module } from '@nestjs/common';
import { INJECTION_TOKEN } from 'src/common/const';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { S3Service } from 'src/service/S3.service';
import { CHATTING_PHOTO_LABEL } from './const';
import { PhotoChattingController } from './controller/photo-chatting.controller';
import { CreatePhotoService } from './service/create-photo.service';
import { GetPhotoChattingService } from './service/get-photo-chatting.service';
import { GetUrlService } from './service/get-url.service';
import { PhotoChattingProxyService } from './service/photo-chatting-proxy.service';
import { PutGalleryService } from './service/put-gallery.service';

@Module({
  controllers: [PhotoChattingController],
  providers: [
    PhotoChattingProxyService,
    PutGalleryService,
    PrismaService,
    GetUrlService,
    CreatePhotoService,
    S3Service,
    GetPhotoChattingService,
    {
      provide: INJECTION_TOKEN,
      useValue: CHATTING_PHOTO_LABEL,
    },
  ],
})
export class PhotoChattingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(PhotoChattingController);
  }
}
