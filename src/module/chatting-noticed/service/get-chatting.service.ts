import { PrismaService } from 'src/service/prisma.service';
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
    return await this.getOne(userId);
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
}
