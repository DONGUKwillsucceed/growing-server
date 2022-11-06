import { PrismaService } from 'src/service/prisma.service';
import { NoticedChattingDto } from '../dto/NoticedChatting.dto';
import { NoticedChattingInterface } from '../types/NoticeInterfaces';
import { Injectable } from '@nestjs/common';
@Injectable()
export class GetChattingService {
  private includeQuery = {
    NoticedChatting: {
      include: {
        Chattings: true,
        Users: true,
      },
    },
  };
  constructor(private readonly prismaService: PrismaService) {}
  async findOne(userId: string) {
    return await this.getOne(userId).then((notice) => {
      if (!notice) {
        return null;
      }
      return this.mapFromRelation(notice);
    });
  }

  async getOne(userId: string) {
    return await this.prismaService.user_NoticedChatting_IsDeleted.findFirst({
      where: {
        userId,
        isDeleted: 0,
      },
      include: this.includeQuery,
    });
  }

  mapFromRelation(notice: NoticedChattingInterface) {
    const noticedChatting = notice.NoticedChatting;
    const dto: NoticedChattingDto = {
      id: noticedChatting.id,
      content: noticedChatting.Chattings.content,
      announcer: noticedChatting.Users.nickName,
      isFolden: !!notice.isFolden,
    };
    return dto;
  }
}
