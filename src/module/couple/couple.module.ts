import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { CoupleController } from './controller/couple.controller';
import { CoupleCodeService } from './service/couple-code.service';
import { CoupleDBService } from './service/couple-db.service';
import { CoupleProxyService } from './service/couple-proxy.service';
import { GetCoupleService } from './service/get-couple.service';
import { InitCoupleService } from './service/init-couple.service';
import { PetCareDBService } from './service/pet-care-db.service';
import { PetDBService } from './service/pet-db.service';

@Module({
  controllers: [CoupleController],
  providers: [
    CoupleProxyService,
    InitCoupleService,
    PrismaService,
    CoupleDBService,
    CoupleCodeService,
    PetCareDBService,
    PetDBService,
    GetCoupleService,
  ],
})
export class CoupleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(CoupleController);
  }
}
