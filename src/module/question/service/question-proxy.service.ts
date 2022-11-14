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

  async findMany(coupleId: string, userId: string) {
    return await this.getQuestionService.findMany(coupleId, userId);
  }

  async answer(
    dto: AnswerDto,
    questionId: string,
    userId: string,
    coupleId: string,
  ) {
    await this.createAnswerService.create(
      dto.content,
      questionId,
      userId,
      coupleId,
    );
  }
}
