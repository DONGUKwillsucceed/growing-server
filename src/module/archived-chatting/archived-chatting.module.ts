import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { ArchivedChattingController } from './controller/archived-chatting.controller';
import { ArchiveChattingService } from './service/archive-chatting.service';
import { ArchivedChattingProxyService } from './service/archived-chatting-proxy.service';
import { UnStoreChattingService } from './service/unstore-chatting.service';

@Module({
  controllers: [ArchivedChattingController],
  providers: [
    ArchiveChattingService,
    ArchivedChattingProxyService,
    PrismaService,
    UnStoreChattingService,
  ],
})
export class ArchivedChattingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(ArchivedChattingController);
  }
}
