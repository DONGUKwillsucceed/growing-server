import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
@Injectable()
export class UserDeviceService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, token: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
      select: { coupleId: true },
    });

    await this.prismaService.fSM_Device_Token.create({
      data: {
        userId,
        coupleId: user.coupleId,
        token,
      },
    });
  }

  async remove(userId: string) {
    await this.prismaService.fSM_Device_Token.deleteMany({ where: { userId } });
  }
}
