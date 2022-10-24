import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './service/prisma.service';
import { S3Service } from './service/S3.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, S3Service],
})
export class AppModule {}
