import { Injectable } from '@nestjs/common';
import { KakaoCodeDto } from '../dto/KakaoCodeDto';
import { KakaoAuthService } from './kakao-auth.service';

@Injectable()
export class AuthProxyService {
  constructor(private readonly kakaoAuthService: KakaoAuthService) {}
  async logIn(dto: KakaoCodeDto) {
    return await this.kakaoAuthService
      .getAccessToken(dto.code)
      .then((token) => this.kakaoAuthService.getKakaoData(token))
      .then((data) => this.kakaoAuthService.login(data));
  }
}
