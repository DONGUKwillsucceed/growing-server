import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FCMService, ISendFirebaseMessages } from 'src/service/FCM.service';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateAnswerService {
  logger = new Logger(CreateAnswerService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fCMService: FCMService,
  ) {}

  async create(
    content: string,
    questionId: string,
    userId: string,
    coupleId: string,
  ) {
    const data = this.createAnswer(content, questionId, userId, coupleId);
    await this.prismaService.pets.updateMany({
      where: { coupleId, isDeleted: 0 },
      data: { loveGauge: { increment: 2 } },
    });
    return this.prismaService.questionStorage
      .create({
        data,
        include: {
          other_QuestionStorage: true,
        },
      })
      .then((result) => {
        this.sendPushMessage(result.userId);
        return result;
      });
  }

  async sendPushMessage(userId: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
      include: { Couples: { include: { Users: true } } },
    });

    const partner = user.Couples.Users.filter((user) => user.id !== userId)[0];
    if (!partner) {
      this.logger.verbose('커플인데 파트너가 없음');
      throw new Error('커플인데 파트너가 없음.');
    }

    const deviceToken = await this.prismaService.fSM_Device_Token.findFirst({
      where: { userId: partner.id },
      select: { token: true },
    });
    if (deviceToken) {
      const fcm: ISendFirebaseMessages = {
        data: {
          title: 'Growing',
          body: `${user.nickName}님이 질문에 답변했어요! 어서 확인해보세요!`,
        },
        token: deviceToken.token,
      };
      await this.fCMService.sendMessages(fcm);
    }
  }

  createAnswer(
    content: string,
    questionId: string,
    userId: string,
    coupleId: string,
  ) {
    const answer: Prisma.QuestionStorageUncheckedCreateInput = {
      content,
      userId,
      id: uuidv4(),
      coupleId,
      parentId: questionId,
    };
    return answer;
  }
}
