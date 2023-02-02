import { Module, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { INJECTION_TOKEN } from 'src/common/const';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { CreateUserService } from '../user/service/create-user.service';
import { UserCodeService } from '../user/service/user-code.service';
import { UserDBService } from '../user/service/user-db.service';
import { UserModule } from '../user/user.module';
import { AUTH_LABEL } from './const';
import { AuthController } from './controller/auth.controller';
import { RefreshController } from './controller/refresh-token.controller';
import { AuthProxyService } from './service/auth-proxy.service';
import { KakaoAuthService } from './service/kakao-auth.service';
import { JWTService } from './service/token.service';

@Module({
  controllers: [AuthController, RefreshController],
  providers: [
    AuthProxyService,
    PrismaService,
    KakaoAuthService,
    CreateUserService,
    UserDBService,
    UserCodeService,
    JWTService,
    JwtService,
    {
      provide: INJECTION_TOKEN,
      useValue: AUTH_LABEL,
    },
  ],
  imports: [UserModule, JwtModule],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(RefreshController);
  }
}
