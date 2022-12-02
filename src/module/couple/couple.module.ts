import { MiddlewareConsumer, Module } from '@nestjs/common';
import { INJECTION_TOKEN } from 'src/common/const';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { COUPLE_LABEL } from './const';
import { CoupleController } from './controller/couple.controller';
import { CoupleDBService } from './service/couple-db.service';
import { CoupleProxyService } from './service/couple-proxy.service';
import { GetCoupleService } from './service/get-couple.service';
import { InitCoupleService } from './service/init-couple.service';
import { PatchCoupleService } from './service/patch-couple.service';
import { PetCareDBService } from './service/pet-care-db.service';
import { PetDBService } from './service/pet-db.service';
import { RemoveCoupleService } from './service/remove-couple.service';
import { UserDBService } from './service/user-db.service';

@Module({
  controllers: [CoupleController],
  providers: [
    CoupleProxyService,
    InitCoupleService,
    PrismaService,
    CoupleDBService,
    PetCareDBService,
    PetDBService,
    GetCoupleService,
    UserDBService,
    PatchCoupleService,
    RemoveCoupleService,
    {
      provide: INJECTION_TOKEN,
      useValue: COUPLE_LABEL,
    },
  ],
})
export class CoupleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(CoupleController);
  }
}
