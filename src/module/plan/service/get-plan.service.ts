import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class GetPlanService {
  constructor(private readonly prismaService: PrismaService) {}
  async findMany(coupleId: string, start: Date, end: Date) {
    return this.getMany(coupleId, start, end);
  }

  async getMany(coupleId: string, start: Date, end: Date) {
    return this.prismaService.plan.findMany({
      where: {
        OR: [
          {
            startAt: { lte: start },
            endAt: { gt: end },
          },
          {
            startAt: { gte: start },
            endAt: { lt: end },
          },
          {
            startAt: { gte: start, lt: end },
            endAt: { gt: end },
          },
          {
            startAt: { lte: start },
            endAt: { gte: start, lte: end },
          },
        ],
        coupleId,
        isDeleted: 0,
      },
      orderBy: { startAt: 'asc' },
    });
  }
}
