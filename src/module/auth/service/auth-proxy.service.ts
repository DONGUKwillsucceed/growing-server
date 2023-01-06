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
    return await this.kakaoAuthService.logIn(dto.code);
  }

  async getAccessToken(userId: string) {
    return await this.jwtService.getAccessTokenAndCookieOption(userId);
  }

  async getRefreshTokenAndOption(userId: string) {
    return await this.jwtService.getRefreshTokenAndCookieOption(userId);
  }
}
