import { PrismaService } from 'src/service/prisma.service';
import { ArchivedChattingDto } from '../dto/ArchivedChatting.dto';
import { ArchivedChattingInterface } from '../types/ArchivedChatting.type';
import { Injectable } from '@nestjs/common';
@Injectable()
export class GetArchivedChattingService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(coupleId: string) {
    return await this.getMany(coupleId).then((chatting) =>
      this.mapFromRelation(chatting),
    );
  }

  async getMany(coupleId: string) {
    return await this.prismaService.chattingStorage.findMany({
      where: { coupleId, isDeleted: 0 },
      include: {
        Chattings: {
          include: {
            Users: true,
          },
        },
      },
    });
  }

  mapFromRelation(chattingStorage: ArchivedChattingInterface[]) {
    return chattingStorage.map((cs) => {
      const dto: ArchivedChattingDto = {
        chattingId: cs.id,
        content: cs.Chattings.content,
        writerName: cs.Chattings.Users.nickName,
        writedAt: cs.Chattings.createdAt,
        archivedAt: cs.createdAt,
      };
      return dto;
    });
  }
}
