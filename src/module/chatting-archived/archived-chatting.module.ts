import { MiddlewareConsumer, Module } from '@nestjs/common';
import { INJECTION_TOKEN } from 'src/common/const';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { CHATTING_ARCHIVED_LABEL } from './const';
import { ArchivedChattingController } from './controller/archived-chatting.controller';
import { ChattingArchivedMapper } from './mapper/chatting-archived.mapper';
import { ArchiveChattingService } from './service/archive-chatting.service';
import { ArchivedChattingProxyService } from './service/archived-chatting-proxy.service';
import { GetArchivedChattingService } from './service/get-archived-chatting.service';
import { UnStoreChattingService } from './service/unstore-chatting.service';

@Module({
  controllers: [ArchivedChattingController],
  providers: [
    ArchiveChattingService,
    ArchivedChattingProxyService,
    PrismaService,
    UnStoreChattingService,
    GetArchivedChattingService,
    ChattingArchivedMapper,
    {
      provide: INJECTION_TOKEN,
      useValue: CHATTING_ARCHIVED_LABEL,
    },
  ],
})
export class ArchivedChattingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(ArchivedChattingController);
  }
}
