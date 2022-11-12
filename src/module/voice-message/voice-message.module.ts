import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PhotoChattingController } from '../chatting-photo/controller/photo-chatting.controller';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { VoiceMessageController } from './controller/voice-message.controller';
import { VoiceMessageProxyService } from './service/voice-message-proxy.service';
import { GetUrlService } from './service/get-url.service';
import { S3Service } from 'src/service/S3.service';
import { PrismaService } from 'src/service/prisma.service';
import { CreateVoiceMessageService } from './service/create-voice-message.service';

@Module({
  controllers: [VoiceMessageController],
  providers: [
    VoiceMessageProxyService,
    GetUrlService,
    CreateVoiceMessageService,
    S3Service,
    PrismaService,
  ],
})
export class VoiceMessageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(VoiceMessageController);
  }
}
