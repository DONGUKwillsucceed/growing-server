import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class GetPlanService {
  constructor(private readonly prismaService: PrismaService) {}
  async findMany(coupleId: string, now: Date) {
    return this.getMany(coupleId, now);
  }

  async getMany(coupleId: string, now: Date) {
    return this.prismaService.plan.findMany({
      where: {
        startAt: {
          gte: now,
        },
        endAt: {
          lte: now,
        },
        coupleId,
        isDeleted: 0,
      },
    });
  }
}
