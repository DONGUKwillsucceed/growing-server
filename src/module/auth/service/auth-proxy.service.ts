import { Injectable } from '@nestjs/common';
import { KakaoCodeDto } from '../dto/KakaoCodeDto';
import { KakaoAuthService } from './kakao-auth.service';
import { JWTService } from './token.service';

@Injectable()
export class AuthProxyService {
  constructor(
    private readonly kakaoAuthService: KakaoAuthService,
    private readonly jwtService: JWTService,
  ) {}
  async logIn(dto: KakaoCodeDto) {
    return await this.kakaoAuthService
      .getAccessToken(dto.code)
      .then((token) => this.kakaoAuthService.getKakaoData(token))
      .then((data) => this.kakaoAuthService.login(data));
  }

  async getAccessTokenAndOption(userId: string) {
    return await this.jwtService.getCookieWithAccessToken(userId);
  }

  async getRefreshTokenAndOption(userId: string) {
    return await this.jwtService.getCookieWithRefreshToken(userId);
  }
}
