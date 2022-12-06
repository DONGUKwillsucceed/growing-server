import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { INJECTION_TOKEN } from 'src/common/const';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { PET_LABEL } from './const';
import { PetController } from './controller/pet.controller';
import { PostPetController } from './controller/post-pet.controller';
import { EmptyPetCareService } from './service/empty-pet-care.service';
import { FeedPetService } from './service/feed-pet.service';
import { GetPetService } from './service/get-pet.service';
import { LovePetService } from './service/love-pet.service';
import { PatchPetService } from './service/patch-pet.service';
import { PetCareDBService } from './service/pet-care-db.service';
import { PetDBService } from './service/pet-db.service';
import { PetImageDBService } from './service/pet-image-db.service';
import { PetProxyService } from './service/pet-proxy.service';
import { PostPetService } from './service/post-pet.service';
import { TouchPetService } from './service/touch-pet.service';

@Module({
  controllers: [PetController, PostPetController],
  providers: [
    PrismaService,
    PetProxyService,
    GetPetService,
    PetDBService,
    PetCareDBService,
    PetImageDBService,
    FeedPetService,
    TouchPetService,
    PostPetService,
    PatchPetService,
    LovePetService,
    EmptyPetCareService,
    {
      provide: INJECTION_TOKEN,
      useValue: PET_LABEL,
    },
  ],
  exports: [LovePetService],
  imports: [ScheduleModule.forRoot()],
})
export class PetModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      .forRoutes(PetController, PostPetController);
  }
}
