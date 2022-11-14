import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { QuestionsAndAnswersDto } from '../dto/QuestionAnswer.dto';
import { QuestionAnswerInterface } from '../types/Question.interface';

@Injectable()
export class GetQuestionService {
  constructor(private readonly prismaService: PrismaService) {}
  async findMany(coupleId: string, userId: string) {
    return await this.getMany(coupleId).then((question) =>
      this.mapFromRelation(question, userId),
    );
  }

  async getMany(coupleId: string) {
    return await this.prismaService.questionStorage.findMany({
      where: { coupleId },
      include: {
        other_QuestionStorage: true,
      },
    });
  }

  mapFromRelation(questions: QuestionAnswerInterface[], userId: string) {
    return questions.map((question) => {
      const myAnswer = question.other_QuestionStorage.find(
        (question) => question.userId === userId,
      );
      const partnerAnswer = question.other_QuestionStorage.find(
        (question) => question.userId !== userId,
      );
      const dto: QuestionsAndAnswersDto = {
        question: {
          id: question.id,
          content: question.content,
          createdAt: question.createdAt,
        },
        myAnswer: {
          id: myAnswer.id,
          content: myAnswer.content,
          createdAt: myAnswer.createdAt,
        },
        partnerAnswer: {
          id: partnerAnswer.id,
          content: partnerAnswer.content,
          createdAt: partnerAnswer.createdAt,
        },
      };
      return dto;
    });
  }
}
