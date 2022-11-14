import { Injectable } from '@nestjs/common';
import { QuestionStorage } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { QuestionsAndAnswersDto } from '../dto/QuestionAnswer.dto';
import { Answer } from '../types/Answer.interface';
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
      where: { coupleId, parentId: null },
      include: {
        other_QuestionStorage: true,
      },
    });
  }

  mapFromRelation(questions: QuestionAnswerInterface[], userId: string) {
    return questions.map((question) => {
      const mine = question.other_QuestionStorage.find(
        (question) => question.userId === userId,
      );
      const partners = question.other_QuestionStorage.find(
        (question) => question.userId !== userId,
      );
      let myAnswer: Answer | null = null;
      let partnerAnswer: Answer | null = null;
      if (mine) {
        myAnswer = this.mapToAnswer(mine);
      }
      if (partners) {
        partnerAnswer = this.mapToAnswer(partners);
      }

      const dto: QuestionsAndAnswersDto = {
        question: {
          id: question.id,
          content: question.content,
          createdAt: question.createdAt,
        },
        myAnswer,
        partnerAnswer,
      };
      return dto;
    });
  }

  mapToAnswer(qs: QuestionStorage) {
    const answer: Answer = {
      id: qs.id,
      content: qs.content,
      createdAt: qs.createdAt,
    };
    return answer;
  }
}
