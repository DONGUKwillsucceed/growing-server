import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreatePlanDto } from '../dto/CreatePlan.dto';
import { PatchPlanDto } from '../dto/PatchPlan.dto';
@Injectable()
export class CreatePatchPlanService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(coupleId: string, dto: CreatePlanDto) {
    const data: Prisma.PlanUncheckedCreateInput = {
      id: uuidv4(),
      title: dto.title,
      startAt: dto.startAt,
      endAt: dto.endAt,
      description: dto.description,
      alarm: dto.alarm,
      latitude: dto.location ? dto.location.latitude : null,
      longitude: dto.location ? dto.location.longitude : null,
      address: dto.location ? dto.location.address : null,
      coupleId,
    };

    return this.prismaService.plan.create({ data });
  }

  async patch(planId: string, dto: PatchPlanDto) {
    const data: Prisma.PlanUpdateInput = {
      title: dto.title,
      startAt: dto.startAt,
      endAt: dto.endAt,
      description: dto.description,
      alarm: dto.alarm,
      latitude: dto.location.latitude,
      longitude: dto.location.longitude,
      address: dto.location.address,
    };

    return this.prismaService.plan.update({ where: { id: planId }, data });
  }
}
