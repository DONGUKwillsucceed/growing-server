import { Plan } from '@prisma/client';
import { PlanDto } from '../dto/Plan.dto';

export class PlanMapper {
  mapFromRelationForMany(plans: Plan[]) {
    return plans.map((plan) => this.mapFromRelationForOne(plan));
  }

  mapFromRelationForOne(plan: Plan) {
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
  }
}
