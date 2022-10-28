import axios from 'axios';
import { env } from 'process';
import { PrismaService } from 'src/service/prisma.service';
import { KakaoData } from '../types/KakaoData';
import { Injectable } from '@nestjs/common';
import { UserProxyService } from 'src/module/user/service/user-proxy.service';

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
    private readonly userProxyService: UserProxyService,
  ) {}

  async login(kakoData: KakaoData) {
    const user = await this.findOneForUserWithKakaoId(kakoData.id);

    if (user) {
      return {
        userId: user.id,
        origin: null,
        kakao: null,
      };
    }

    const userCreated = await this.userProxyService.createWithKakaoData(
      kakoData,
    );

    return { userId: userCreated.id, origin: null, kakao: null };
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
