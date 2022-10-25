import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './service/prisma.service';
import { S3Service } from './service/S3.service';
import { UserModule } from './module/user/user.module';
import { CoupleModule } from './module/couple/couple.module';

@Module({
  imports: [UserModule, CoupleModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
