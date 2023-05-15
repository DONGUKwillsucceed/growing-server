import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { INJECTION_TOKEN } from 'src/common/const';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { QUESTION_LABEL } from './const';
import { QuestionController } from './controller/question.controller';
import { QuestionMapper } from './mapper/question.mapper';
import { CreateAnswerService } from './service/create-answer.service';
import { CreateQuestionService } from './service/create-question.service';
import { GetQuestionService } from './service/get-question.service';
import { QuestionProxyService } from './service/question-proxy.service';
import { FCMService } from 'src/service/FCM.service';

@Module({
  controllers: [QuestionController],
  providers: [
    GetQuestionService,
    QuestionProxyService,
    PrismaService,
    CreateAnswerService,
    CreateQuestionService,
    QuestionMapper,
    FCMService,
    {
      provide: INJECTION_TOKEN,
      useValue: QUESTION_LABEL,
    },
  ],
  imports: [ScheduleModule.forRoot()],
})
export class QuestionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(QuestionController);
  }
}
