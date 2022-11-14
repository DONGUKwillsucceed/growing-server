import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { QuestionController } from './controller/question.controller';
import { CreateAnswerService } from './service/create-answer.service';
import { GetQuestionService } from './service/get-question.service';
import { QuestionProxyService } from './service/question-proxy.service';

@Module({
  controllers: [QuestionController],
  providers: [
    GetQuestionService,
    QuestionProxyService,
    PrismaService,
    CreateAnswerService,
  ],
})
export class QuestionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(QuestionController);
  }
}
