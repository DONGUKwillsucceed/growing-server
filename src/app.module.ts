import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './service/prisma.service';
import { S3Service } from './service/S3.service';
import { UserModule } from './module/user/user.module';
import { CoupleModule } from './module/couple/couple.module';
import { AuthMiddleWare } from './common/middleware/auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule, CoupleModule, JwtModule],
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
