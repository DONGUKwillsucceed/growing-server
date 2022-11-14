import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateQuestionService {
  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async create() {
    const ids = await this.getManyForCoupleIdWithBothAnswered();
    ids.forEach(async (id) => {
      const content = await this.generateContent(id);
      const data = this.createQuestion(id, content);
      await this.prismaService.questionStorage.create({ data });
      console.log('created');
    });
  }

  createQuestion(coupleId: string, content: string) {
    const data: Prisma.QuestionStorageUncheckedCreateInput = {
      id: uuidv4(),
      coupleId,
      content,
    };
    return data;
  }

  async generateContent(id: string) {
    const length = await this.prismaService.questions_Warehouse.count();
    let content: string = '';
    while (true) {
      const randomId = Math.floor(Math.random() * length);
      content = await this.getOneForContentWithRandomId(randomId);
      const isUsed = await this.isUsed(id, content);
      if (!isUsed) {
        return content;
      }
    }
  }

  async getOneForContentWithRandomId(randomId: number) {
    const question = await this.prismaService.questions_Warehouse.findFirst({
      where: { id: randomId },
      select: { content: true },
    });
    return question.content;
  }

  async isUsed(coupleId: string, content: string) {
    return await this.prismaService.questionStorage.findFirst({
      where: {
        coupleId,
        content,
        parentId: null,
      },
    });
  }

  async getManyForCoupleIdWithBothAnswered() {
    const ids = await this.prismaService.questionStorage
      .groupBy({
        where: {
          parentId: null,
        },
        by: ['coupleId'],
      })
      .then((questions) => questions.map((question) => question.coupleId));

    const coupleIds: string[] = [];
    for (const id of ids) {
      const coupleId = await this.prismaService.questionStorage
        .findFirst({
          where: { coupleId: id, parentId: null },
          orderBy: { createdAt: 'desc' },
          include: { other_QuestionStorage: true },
        })
        .then((question) => {
          if (question.other_QuestionStorage.length === 2) {
            return question.coupleId;
          }
        });
      if (coupleId) {
        coupleIds.push(coupleId);
      }
    }
    return coupleIds;
  }
}
