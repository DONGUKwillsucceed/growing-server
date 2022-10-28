import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthProxyService } from './service/auth-proxy.service';
import { KakaoAuthService } from './service/kakao-auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthProxyService, PrismaService, KakaoAuthService],
  imports: [UserModule],
})
export class AuthModule {}
