import { Injectable } from '@nestjs/common';
import { KakaoData } from 'src/module/auth/types/KakaoData';
import { CreateUserService } from './create-user.service';

@Injectable()
export class UserProxyService {
  constructor(private readonly createUserService: CreateUserService) {}
  async createWithKakaoData(kakaoData: KakaoData) {
    return await this.createUserService.createWithKakaoData(kakaoData);
  }
}
