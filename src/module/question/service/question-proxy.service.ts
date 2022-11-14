import { Injectable } from '@nestjs/common';
import { GetQuestionService } from './get-question.service';

@Injectable()
export class QuestionProxyService {
  constructor(private readonly getQuestionService: GetQuestionService) {}

  async findMany(coupleId: string) {}

  async answer() {}
}
