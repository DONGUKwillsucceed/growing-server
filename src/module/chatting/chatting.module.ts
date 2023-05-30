import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { S3Service } from 'src/service/S3.service';
import { ChattingController } from './controller/chatting.controller';
import { ChattingDBService } from './service/chatting-db.service';
import { ChattingGateway } from './controller/chatting.gateway';
import { ChattingProxyService } from './service/chatting-proxy.service';
import { ChattingS3Service } from './service/chatting-s3.service';
import { DeleteChattingService } from './service/delete-chatting.service';
import { GetChattingPhotoService } from './service/get-chatting-photo.service';
import { GetChattingService } from './service/get-chatting.service';
import { CreateChattingService } from './service/create-chatting.service';
import { INJECTION_TOKEN } from 'src/common/const';
import { CHATTING_LABEL } from './const';
import { UpdateChattingService } from './service/update-chatting.service';
import { FCMService } from 'src/service/FCM.service';

@Module({
  controllers: [ChattingController],
  providers: [
    ChattingProxyService,
    GetChattingService,
    ChattingDBService,
    ChattingS3Service,
    PrismaService,
    S3Service,
    DeleteChattingService,
    GetChattingPhotoService,
    ChattingGateway,
    CreateChattingService,
    UpdateChattingService,
    FCMService,
    {
      provide: INJECTION_TOKEN,
      useValue: CHATTING_LABEL,
    },
  ],
})
export class ChattingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(ChattingController);
  }
}
