import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
@Injectable()
export class RemovePlanService {
  constructor(private readonly prismaService: PrismaService) {}

  async remove(planId: string) {
    await this.prismaService.plan.update({
      where: { id: planId },
      data: { isDeleted: 1 },
    });
  }
}
