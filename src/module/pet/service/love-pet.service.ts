import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class LovePetService {
  constructor(private readonly prismaService: PrismaService) {}

  async increaseLoveGauge(coupleId: string, amount: number) {
    return this.prismaService.pets.updateMany({
      where: { coupleId, isDeleted: 0 },
      data: {
        loveGauge: {
          increment: amount,
        },
      },
    });
  }
}
