import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { NoticedChattingController } from './controller/noticed-chatting.controller';
import { NotifyChattingService } from './service/notify-chatting.service';
import { NoticedChattingProxyService } from './service/noticed-chatting-proxy.service';
import { PrismaService } from 'src/service/prisma.service';
import { GetChattingService } from './service/get-chatting.service';

@Module({
  controllers: [NoticedChattingController],
  providers: [
    NoticedChattingProxyService,
    NotifyChattingService,
    PrismaService,
    GetChattingService,
  ],
})
export class NoticedChattingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(NoticedChattingController);
  }
}
