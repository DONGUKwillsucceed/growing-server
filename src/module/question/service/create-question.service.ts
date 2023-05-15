import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { FCMService, ISendFirebaseMessages } from 'src/service/FCM.service';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateQuestionService {
  logger = new Logger(CreateQuestionService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fCMService: FCMService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async create() {
    const ids = await this.getManyForCoupleIdWithBothAnswered();
    ids.forEach(async (id) => {
      const content = await this.generateContent(id);
      const data = this.createQuestion(id, content);
      await this.prismaService.questionStorage.create({ data });
      this.logger.log(`커플 ${id}를 위한 질문이 생성됨`);
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

  async sendPushMessage(coupleId: string) {
    const fcm: ISendFirebaseMessages = {
      title: '새로운 질문',
      message: '새로운 질문이 왔어요! 어서 확인해보세요!!',
      token: '12',
    };
    await this.fCMService.sendMessages(fcm);
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
