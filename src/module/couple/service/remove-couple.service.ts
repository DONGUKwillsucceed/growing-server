import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveCoupleService {
  constructor(private readonly prismaService: PrismaService) {}

  async remove(coupleId: string) {
    this.removeCouple(coupleId);
    this.makePeopleToSolo(coupleId);
  }

  async removeCouple(coupleId: string) {
    await this.prismaService.couples.update({
      where: { id: coupleId },
      data: { isDeleted: 1 },
    });
  }

  async makePeopleToSolo(coupleId: string) {
    await this.prismaService.users.updateMany({
      where: { coupleId },
      data: { coupleId: null },
    });
  }
}
