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
    await this.getPetID(coupleId).then(async (petId) => {
      if (!(await this.isUsedStorage(petId))) {
        await this.increasePetLoveGauge(petId);
      }
    });
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

  async increasePetLoveGauge(id: string) {
    await this.prismaService.pets.update({
      where: { id },
      data: {
        loveGauge: {
          increment: 2,
        },
      },
    });

    await this.prismaService.petCare.update({
      where: { id },
      data: { isUseStorage: 1 },
    });
  }

  async getPetID(coupleId: string) {
    const { id } = await this.prismaService.pets.findFirst({
      where: { coupleId, isDeleted: 0 },
      select: { id: true },
    });
    return id;
  }

  async isUsedStorage(id: string) {
    const { isUseStorage } = await this.prismaService.petCare.findUnique({
      where: { id },
      select: { isUseStorage: true },
    });
    return isUseStorage;
  }
}
