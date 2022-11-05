import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { v4 } from 'uuid';

@Injectable()
export class NotifyChattingService {
  constructor(private readonly prismaService: PrismaService) {}

  async notify(coupleId: string, chattingId: string, userId: string) {
    const users = await this.findManyForUsersWithCoupleId(coupleId);
    const noticedChatting = await this.createForNoticedChatting(
      userId,
      chattingId,
    );
    for (const user of users) {
      await this.createForNoticedChatting_IsDeleted(
        user.id,
        noticedChatting.id,
      );
    }
  }

  async findManyForUsersWithCoupleId(coupleId: string) {
    const couple = await this.prismaService.couples.findUnique({
      where: {
        id: coupleId,
      },
      include: {
        Users: true,
      },
    });

    return couple.Users;
  }

  async createForNoticedChatting(userId: string, chattingId: string) {
    const data: Prisma.NoticedChattingUncheckedCreateInput = {
      id: v4(),
      chattingID: chattingId,
      userId,
    };
    return await this.prismaService.noticedChatting.create({ data });
  }

  async createForNoticedChatting_IsDeleted(userId: string, chattingId: string) {
    const data: Prisma.User_NoticedChatting_IsDeletedUncheckedCreateInput = {
      userId,
      noticedChattingId: chattingId,
    };
    return await this.prismaService.user_NoticedChatting_IsDeleted.create({
      data,
    });
  }
}
