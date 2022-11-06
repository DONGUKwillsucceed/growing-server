import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ArchiveChattingService {
  constructor(private readonly prismaService: PrismaService) {}

  async archive(coupleId: string, userId: string, chattingId: string) {
    const data = this.createChattingStorageData(coupleId, userId, chattingId);
    await this.create(data);
  }

  async create(data: Prisma.ChattingStorageUncheckedCreateInput) {
    await this.prismaService.chattingStorage.create({
      data,
    });
  }

  createChattingStorageData(
    coupleId: string,
    userId: string,
    chattingId: string,
  ) {
    const data: Prisma.ChattingStorageUncheckedCreateInput = {
      id: uuidv4(),
      chattingId,
      userId,
      coupleId,
    };
    return data;
  }
}
