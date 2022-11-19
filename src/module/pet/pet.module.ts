import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { PetController } from './controller/pet.controller';
import { PostPetController } from './controller/post-pet.controller';
import { FeedPetService } from './service/feed-pet.service';
import { GetPetService } from './service/get-pet.service';
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
  ],
})
export class PetModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      .forRoutes(PetController, PostPetController);
  }
}
