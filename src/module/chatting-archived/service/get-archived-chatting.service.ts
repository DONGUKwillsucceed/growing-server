import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class GetArchivedChattingService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(coupleId: string) {
    return this.getMany(coupleId);
  }

  async getMany(coupleId: string) {
    return this.prismaService.chattingStorage.findMany({
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
}
