import { Module } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { NoticeController } from './notice.controller';
import { PrismaService } from 'src/service/prisma.service';

@Module({
  controllers: [NoticeController],
  providers: [PrismaService],
})
export class NoticeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(NoticeController);
  }
}
