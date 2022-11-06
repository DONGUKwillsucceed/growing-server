import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UnStoreChattingService {
  constructor(private readonly prismaService: PrismaService) {}

  async unstore(chattingId: string) {
    await this.updateWithIsDeleted(chattingId);
  }

  async updateWithIsDeleted(chattingId: string) {
    await this.prismaService.chattingStorage.update({
      where: { id: chattingId },
      data: {
        isDeleted: 1,
      },
    });
  }
}
