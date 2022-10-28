import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { CreateUserService } from '../user/service/create-user.service';
import { UserCodeService } from '../user/service/user-code.service';
import { UserDBService } from '../user/service/user-db.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthProxyService } from './service/auth-proxy.service';
import { KakaoAuthService } from './service/kakao-auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthProxyService,
    PrismaService,
    KakaoAuthService,
    CreateUserService,
    UserDBService,
    UserCodeService,
  ],
  imports: [UserModule],
})
export class AuthModule {}
