import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
@Injectable()
export class RemoveChattingService {
  constructor(private readonly prismaService: PrismaService) {}

  async foldOrUnFold(userId: string, noticeId: string) {
    const isFolden = await this.getOneForIsFolden(userId, noticeId);
    if (!isFolden) {
      await this.fold(userId, noticeId);
      return { result: true };
    }

    await this.unfold(userId, noticeId);
    return { result: false };
  }

  async delete(userId: string, noticeId: string) {
    await this.updateOneWithIsDeleted(userId, noticeId);
  }

  private async getOneForIsFolden(userId: string, noticeId: string) {
    const noticedChatting =
      await this.prismaService.user_NoticedChatting_IsDeleted.findFirst({
        where: {
          userId,
          noticedChattingId: noticeId,
        },
      });
    return noticedChatting.isFolden;
  }

  private async fold(userId: string, noticeId: string) {
    return await this.prismaService.user_NoticedChatting_IsDeleted.updateMany({
      where: {
        userId,
        noticedChattingId: noticeId,
      },
      data: {
        isFolden: 1,
      },
    });
  }

  private async unfold(userId: string, noticeId: string) {
    return await this.prismaService.user_NoticedChatting_IsDeleted.updateMany({
      where: {
        userId,
        noticedChattingId: noticeId,
      },
      data: {
        isFolden: 0,
      },
    });
  }

  private async updateOneWithIsDeleted(userId: string, noticeId: string) {
    return await this.prismaService.user_NoticedChatting_IsDeleted.updateMany({
      where: {
        userId,
        noticedChattingId: noticeId,
      },
      data: {
        isDeleted: 1,
      },
    });
  }
}
