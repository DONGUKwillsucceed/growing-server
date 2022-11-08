import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { PhotoChattingController } from './controller/photo-chatting.controller';
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
  ],
})
export class PhotoChattingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(PhotoChattingController);
  }
}
