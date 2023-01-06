import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { env } from 'process';
import { ClaimType } from 'src/common/interface/AuthRequest';
import { CreateJWTDto } from '../dto/CreateJWT.dto';

@Injectable()
export class JWTService {
  constructor(private readonly jwtService: JwtService) {}

  async checkRefresh(refreshToken: string) {
    const result = await this.jwtService.verifyAsync(refreshToken, {
      secret: env.MY_SECRET_KEY,
    });
    return result;
  }

  async getAccessTokenAndCookieOption(userId: string) {
    const payload: CreateJWTDto = {
      uid: userId,
      type: ClaimType.Client,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: env.MY_SECRET_KEY,
      expiresIn: `${env.ACCESS_TOKEN_EXPIRES}s`,
    });
    return {
      accessToken: token,
      accessOption: {
        path: '/',
        maxAge: Number(env.ACCESS_TOKEN_EXPIRES) * 1000,
        sameSite: 'none' as const,
        secure: true,
      },
    };
  }

  async getRefreshTokenAndCookieOption(userId: string) {
    const payload: CreateJWTDto = {
      uid: userId,
      type: ClaimType.Client,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: env.MY_SECRET_KEY,
      expiresIn: `${env.RERESH_TOKEN_EXPIRES}s`,
    });
    return {
      refreshToken: token,
      refreshOption: {
        path: '/',
        maxAge: Number(env.RERESH_TOKEN_EXPIRES) * 1000,
        sameSite: 'none' as const,
        //secure: true,
      },
    };
  }
}
