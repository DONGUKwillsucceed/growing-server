import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { ConfirmChattingDto } from '../dto/ConfirmChatting.dto';

@Injectable()
export class UpdateChattingService {
  constructor(private readonly prismaService: PrismaService) {}

  async confirm(dto: ConfirmChattingDto) {
    const { coupleId, userId } = dto;
    const partnerId = await this.prismaService.couples
      .findUnique({
        where: { id: coupleId },
        select: { Users: true },
      })
      .then((result) => {
        if (!result) {
          throw new NotFoundException('Couple Not Found');
        }
        return result.Users.map((user) => user.id).find(
          (ids) => ids !== userId,
        );
      });

    const chattingIds = await this.prismaService.chattings
      .findMany({
        where: {
          coupleId,
          userId: partnerId,
          isConfirmed: 0,
          User_Chatting_IsDeleted: {
            some: { userId: partnerId, isDeleted: 0 },
          },
        },
        select: { id: true },
      })
      .then((result) => result.map((chatting) => chatting.id));

    for (const chattingId of chattingIds) {
      await this.prismaService.chattings.update({
        where: { id: chattingId },
        data: { isConfirmed: 1 },
      });
    }

    return { chattingIds };
  }
}
