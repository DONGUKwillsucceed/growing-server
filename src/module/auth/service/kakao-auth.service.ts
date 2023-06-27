import axios from 'axios';
import { env } from 'process';
import { PrismaService } from 'src/service/prisma.service';
import { KakaoData } from '../types/KakaoData';
import { Injectable } from '@nestjs/common';
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

  async logIn(code: string) {
    return await this.getAccessToken(code)
      .then((token) => this.getKakaoData(token))
      .then(async (kakaoData) => {
        let user = await this.getOneForUser(kakaoData.id);
        if (!user) {
          user = await this.createUserService.createWithKakaoData(kakaoData);
        }
        return user.id;
      });
  }

  async getOneForUser(kakaoId: number) {
    return await this.prismaService.users.findFirst({
      where: { kakaoId: kakaoId.toString() },
    });
  }

  async getAccessToken(code: string) {
    const get_token_url = `${this.get_token_url}`
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const res = await axios
      .post(
        `${get_token_url}${code}`,
        {},
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      )
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
    return res.data.access_token;
  }

  async getKakaoData(accessToken: string) {
    const res = await axios
      .post<KakaoData>(
        this.get_user_url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      )
      .catch((err) => {
        console.log(err.response);
        throw new Error(err.reponse);
      });
    return res.data;
  }
}
