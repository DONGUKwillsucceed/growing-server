import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { VoiceMessageController } from './controller/voice-message.controller';
import { VoiceMessageProxyService } from './service/voice-message-proxy.service';
import { GetUrlService } from './service/get-url.service';
import { S3Service } from 'src/service/S3.service';
import { PrismaService } from 'src/service/prisma.service';
import { CreateVoiceMessageService } from './service/create-voice-message.service';
import { VOICE_MSG_LABEL } from './const';
import { INJECTION_TOKEN } from 'src/common/const';
import { GetVoiceMessageService } from './service/get-voice-message.service';
import { VoiceMessageMapper } from './mapper/voice-message.mapper';

@Module({
  controllers: [VoiceMessageController],
  providers: [
    VoiceMessageProxyService,
    GetUrlService,
    CreateVoiceMessageService,
    S3Service,
    PrismaService,
    GetVoiceMessageService,
    VoiceMessageMapper,
    {
      provide: INJECTION_TOKEN,
      useValue: VOICE_MSG_LABEL,
    },
  ],
})
export class VoiceMessageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(VoiceMessageController);
  }
}
