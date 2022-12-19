import { Injectable } from '@nestjs/common';
import { AnswerDto } from '../dto/Answer.dto';
import { CreateAnswerService } from './create-answer.service';
import { GetQuestionService } from './get-question.service';

@Injectable()
export class QuestionProxyService {
  constructor(
    private readonly getQuestionService: GetQuestionService,
    private readonly createAnswerService: CreateAnswerService,
  ) {}

  async findMany(coupleId: string) {
    return this.getQuestionService.findMany(coupleId);
  }

  async isRemain(coupleId: string, userId: string) {
    return this.getQuestionService.isRemain(coupleId, userId);
  }

  async answer(
    dto: AnswerDto,
    questionId: string,
    userId: string,
    coupleId: string,
  ) {
    return this.createAnswerService.create(
      dto.content,
      questionId,
      userId,
      coupleId,
    );
  }
}
