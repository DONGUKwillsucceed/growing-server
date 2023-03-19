import { Injectable } from '@nestjs/common';
import { prisma, Prisma } from '@prisma/client';
import { KakaoData } from 'src/module/auth/types/KakaoData';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { UserCodeService } from './user-code.service';
import { UserDBService } from './user-db.service';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userDBService: UserDBService,
    private readonly userCodeService: UserCodeService,
    private readonly prismaService: PrismaService,
  ) {}

  async createWithKakaoData(kakaoData: KakaoData) {
    const code = await this.userCodeService.generateOne();
    const data = this.createUserData(kakaoData, code);
    const user = await this.userDBService.create(data);
    const emojiPackIds = [
      'bef7a678-e44b-4c80-8c5f-1b0af1848821',
      '531f31ce-8450-46f8-8b32-bc2e87fb5a5c',
      'f41962ba-caa9-4c82-ba37-ff7683421343',
    ];
    for (const packId of emojiPackIds) {
      await this.prismaService.emoji_Order.create({
        data: {
          id: uuidv4(),
          buyerId: user.id,
          emojiPackId: packId,
        },
      });
    }
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
