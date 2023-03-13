import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from '../dto/CreatePlan.dto';
import { PatchPlanDto } from '../dto/PatchPlan.dto';
import { CreatePatchPlanService } from './create-plan.service';
import { GetPlanService } from './get-plan.service';
import { RemovePlanService } from './remove-plan.service';

@Injectable()
export class PlanProxyService {
  constructor(
    private readonly getPlanService: GetPlanService,
    private readonly createPatchPlanService: CreatePatchPlanService,
    private readonly removePlanService: RemovePlanService,
  ) {}
  async findMany(coupleId: string, start: Date, end: Date) {
    return this.getPlanService.findMany(coupleId, start, end);
  }

  async create(coupleId: string, dto: CreatePlanDto) {
    return this.createPatchPlanService.create(coupleId, dto);
  }

  async patch(planId: string, dto: PatchPlanDto) {
    return this.createPatchPlanService.patch(planId, dto);
  }

  async remove(planId: string) {
    await this.removePlanService.remove(planId);
  }
}
