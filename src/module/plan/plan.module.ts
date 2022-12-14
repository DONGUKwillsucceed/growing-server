import { Module, MiddlewareConsumer } from '@nestjs/common';
import { INJECTION_TOKEN } from 'src/common/const';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { PLAN_LABEL } from './const';
import { PlanController } from './controller/plan.controller';
import { PlanMapper } from './mapper/plan.mapper';
import { CreatePatchPlanService } from './service/create-plan.service';
import { GetPlanService } from './service/get-plan.service';
import { PlanProxyService } from './service/plan-proxy.service';
import { RemovePlanService } from './service/remove-plan.service';
@Module({
  controllers: [PlanController],
  providers: [
    PlanProxyService,
    GetPlanService,
    PrismaService,
    CreatePatchPlanService,
    RemovePlanService,
    PlanMapper,
    {
      provide: INJECTION_TOKEN,
      useValue: PLAN_LABEL,
    },
  ],
})
export class PlanModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(PlanController);
  }
}
