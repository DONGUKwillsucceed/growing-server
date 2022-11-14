import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { QuestionController } from './controller/question.controller';
import { CreateAnswerService } from './service/create-answer.service';
import { CreateQuestionService } from './service/create-question.service';
import { GetQuestionService } from './service/get-question.service';
import { QuestionProxyService } from './service/question-proxy.service';

@Module({
  controllers: [QuestionController],
  providers: [
    GetQuestionService,
    QuestionProxyService,
    PrismaService,
    CreateAnswerService,
    CreateQuestionService,
  ],
  imports: [ScheduleModule.forRoot()],
})
export class QuestionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(QuestionController);
  }
}
