import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/service/prisma.service';
import { CreateUserService } from '../user/service/create-user.service';
import { UserCodeService } from '../user/service/user-code.service';
import { UserDBService } from '../user/service/user-db.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthProxyService } from './service/auth-proxy.service';
import { KakaoAuthService } from './service/kakao-auth.service';
import { JWTService } from './service/token.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthProxyService,
    PrismaService,
    KakaoAuthService,
    CreateUserService,
    UserDBService,
    UserCodeService,
    JWTService,
    JwtService,
  ],
  imports: [UserModule, JwtModule],
})
export class AuthModule {}
