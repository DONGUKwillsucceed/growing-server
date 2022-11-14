import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { QuestionController } from './controller/question.controller';
import { GetQuestionService } from './service/get-question.service';
import { QuestionProxyService } from './service/question-proxy.service';

@Module({
  controllers: [QuestionController],
  providers: [GetQuestionService, QuestionProxyService],
})
export class QuestionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(QuestionController);
  }
}
