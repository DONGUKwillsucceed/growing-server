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
import { NoticedChattingModule } from './module/chatting-noticed/noticed-chatting.module';
import { ArchivedChattingModule } from './module/chatting-archived/archived-chatting.module';
import { PhotoChattingModule } from './module/chatting-photo/chatting-photo.module';
import { VoiceMessageModule } from './module/voice-message/voice-message.module';
import { QuestionModule } from './module/question/question.module';
import { GalleryModule } from './module/gallery/gallery.module';
import { S3Service } from './service/S3.service';
import { PlanModule } from './module/plan/plan.module';

@Module({
  imports: [
    UserModule,
    CoupleModule,
    JwtModule,
    PetModule,
    AuthModule,
    JwtModule,
    ChattingModule,
    NoticedChattingModule,
    ArchivedChattingModule,
    PhotoChattingModule,
    VoiceMessageModule,
    QuestionModule,
    PlanModule,
    GalleryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService, S3Service],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
