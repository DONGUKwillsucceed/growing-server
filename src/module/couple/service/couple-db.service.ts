import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
@Injectable()
export class CoupleDBService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(coupleId: string) {
    return await this.prismaService.couples.findUnique({
      where: { id: coupleId },
      include: {
        Users: true,
        Pets: {
          where: {
            endedAt: null,
          },
        },
      },
    });
  }

  async create(data: Prisma.CouplesUncheckedCreateInput) {
    return await this.prismaService.couples.create({ data });
  }
}
