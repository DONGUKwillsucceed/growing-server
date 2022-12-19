import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class GetQuestionService {
  constructor(private readonly prismaService: PrismaService) {}
  async findMany(coupleId: string) {
    return await this.getMany(coupleId);
  }

  async isRemain(coupleId: string, userId: string) {
    let result = false;
    let cnt = 0;
    return await this.getMany(coupleId)
      .then((questions) =>
        questions.map((question) => question.other_QuestionStorage),
      )
      .then((questions) =>
        questions.forEach((question) => {
          cnt = 0;
          for (const answer of question) {
            if (answer.userId === userId) {
              cnt++;
            }
          }
          if (!cnt) result = true;
        }),
      )
      .then(() => {
        return { result };
      });
  }

  async getMany(coupleId: string) {
    return await this.prismaService.questionStorage.findMany({
      where: { coupleId, parentId: null },
      include: {
        other_QuestionStorage: true,
      },
    });
  }
}
