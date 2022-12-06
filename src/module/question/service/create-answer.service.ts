import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateAnswerService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    content: string,
    questionId: string,
    userId: string,
    coupleId: string,
  ) {
    const data = this.createAnswer(content, questionId, userId, coupleId);
    await this.prismaService.questionStorage.create({ data });
    await this.prismaService.pets.updateMany({
      where: { coupleId, isDeleted: 0 },
      data: { loveGauge: { increment: 2 } },
    });
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
