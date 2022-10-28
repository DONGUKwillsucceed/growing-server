import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDBService {
  constructor(private readonly prismaService: PrismaService) {}

  async update(userId: string, coupleId: string) {
    this.prismaService.users.update({
      where: {
        id: userId,
      },
      data: {
        coupleId,
      },
    });
  }
}
