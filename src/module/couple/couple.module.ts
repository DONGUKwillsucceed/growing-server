import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { CoupleController } from './controller/couple.controller';
import { CoupleCodeService } from './service/couple-code.service';
import { CoupleDBService } from './service/couple-db.service';
import { CoupleProxyService } from './service/couple-proxy.service';
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
  ],
})
export class CoupleModule {}
