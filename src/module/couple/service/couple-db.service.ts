import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
@Injectable()
export class CoupleDBService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneWithCode(code: string) {
    return await this.prismaService.couples.findFirst({
      where: { verificationCode: code },
    });
  }

  async create(data: Prisma.CouplesUncheckedCreateInput) {
    return await this.prismaService.couples.create({ data });
  }
}
