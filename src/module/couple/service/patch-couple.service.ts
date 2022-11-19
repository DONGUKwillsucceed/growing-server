import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PatchCoupleService {
  constructor(private readonly prismaService: PrismaService) {}

  async patch(coupleId: string, anniversaryDay: string) {
    await this.prismaService.couples.update({
      where: { id: coupleId },
      data: {
        anniversaryDay: new Date(anniversaryDay),
        modifiedAt: new Date(),
      },
    });
  }
}
