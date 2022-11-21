import { Injectable } from '@nestjs/common';
import { Plan } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { PlanDto } from '../dto/Plan.dto';

@Injectable()
export class GetPlanService {
  constructor(private readonly prismaService: PrismaService) {}
  async findMany(coupleId: string, now: Date) {
    return await this.getMany(coupleId, now).then((plans) =>
      this.mapFromRelation(plans),
    );
  }

  async getMany(coupleId: string, now: Date) {
    return await this.prismaService.plan.findMany({
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

  mapFromRelation(plans: Plan[]) {
    return plans.map((plan) => {
      const dto: PlanDto = {
        id: plan.id,
        title: plan.title,
        startAt: plan.startAt,
        endAt: plan.endAt,
        description: plan.description,
        alarm: plan.alarm,
        location: {
          latitude: plan.latitude,
          longitude: plan.longitude,
          address: plan.address,
        },
      };
      return dto;
    });
  }
}
