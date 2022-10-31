import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './service/prisma.service';
import { UserModule } from './module/user/user.module';
import { CoupleModule } from './module/couple/couple.module';
import { AuthMiddleWare } from './common/middleware/auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PetModule } from './module/pet/pet.module';
import { AuthModule } from './module/auth/auth.module';
import { ChattingModule } from './module/chatting/chatting.module';

@Module({
  imports: [
    UserModule,
    CoupleModule,
    JwtModule,
    PetModule,
    AuthModule,
    JwtModule,
    ChattingModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
