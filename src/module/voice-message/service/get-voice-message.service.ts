import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class GetVoiceMessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(coupleId: string) {
    return this.prismaService.voiceStorage.findMany({
      where: { coupleId, isDeleted: 0 },
    });
  }
}
