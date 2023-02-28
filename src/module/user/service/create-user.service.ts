import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { KakaoData } from 'src/module/auth/types/KakaoData';
import { v4 as uuidv4 } from 'uuid';
import { UserCodeService } from './user-code.service';
import { UserDBService } from './user-db.service';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userDBService: UserDBService,
    private readonly userCodeService: UserCodeService,
  ) {}

  async createWithKakaoData(kakaoData: KakaoData) {
    const code = await this.userCodeService.generateOne();
    const data = this.createUserData(kakaoData, code);
    return await this.userDBService.create(data);
  }

  private createUserData(kakaoData: KakaoData, code: string) {
    const user: Prisma.UsersUncheckedCreateInput = {
      id: uuidv4(),
      kakaoId: kakaoData.id.toString(),
      verificationCode: code,
      profileId: null,
    };
    return user;
  }
}
