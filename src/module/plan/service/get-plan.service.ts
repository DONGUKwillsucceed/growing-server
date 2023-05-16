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
        NOT: [
          { startAt: { lt: start }, endAt: { lt: start } },
          { startAt: { gte: end }, endAt: { gte: end } },
        ],
        coupleId,
        isDeleted: 0,
      },
      orderBy: { startAt: 'asc' },
    });
  }
}
