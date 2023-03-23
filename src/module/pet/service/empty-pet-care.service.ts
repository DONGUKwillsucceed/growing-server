import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
@Injectable()
export class EmptyPetCareService {
  constructor(private readonly prismaService: PrismaService) {}
  @Cron(CronExpression.EVERY_DAY_AT_3PM)
  async empty() {
    await this.prismaService.petCare.updateMany({
      where: { Pets: { some: { isDeleted: 0 } } },
      data: {
        isFemaleSpeakLoveU: 0,
        isMaleSpeakLoveU: 0,
        isHaveBreakfast: 0,
        isHaveDinner: 0,
        isUseStorage: 0,
        touchCount: 0,
      },
    });
  }
}
