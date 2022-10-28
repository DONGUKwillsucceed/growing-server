import axios from 'axios';
import { env } from 'process';
import { PrismaService } from 'src/service/prisma.service';
import { KakaoData } from '../types/KakaoData';
import { Injectable } from '@nestjs/common';
import { UserDBService } from 'src/module/user/service/user-db.service';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserService } from 'src/module/user/service/create-user.service';

@Injectable()
export class KakaoAuthService {
  private readonly get_user_url = 'https://kapi.kakao.com/v2/user/me';
  private readonly get_token_url = `https://kauth.kakao.com/oauth/token
	?grant_type=authorization_code
	&client_id=${env.KAKAO_CLIENT_ID}
	&redirect_url=${env.KAKAO_REDIRECT_URL}
	&code=`;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly createUserService: CreateUserService,
  ) {}

  async login(kakoData: KakaoData) {
    const user = await this.findOneForUserWithKakaoId(kakoData.id);

    if (user) {
      return {
        userId: user.id,
      };
    }

    const userCreated = await this.createUserService.createWithKakaoData(
      kakoData,
    );

    return { userId: userCreated.id };
  }

  async findOneForUserWithKakaoId(kakaoId: number) {
    return await this.prismaService.users.findFirst({
      where: {
        kakaoId: kakaoId,
      },
    });
  }

  async getAccessToken(code: string) {
    const res = await axios.post(`${this.get_token_url}${code}`);
    return res.data;
  }

  async getKakaoData(accessToken: string) {
    const res = await axios.get<KakaoData>(this.get_user_url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  }
}
