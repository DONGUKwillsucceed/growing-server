import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class UserDBService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUnique(userId: string) {
    return await this.prismaService.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        Couples: {
          include: {
            Users: true,
          },
        },
        Photos_PhotosToUsers_profileId: true,
      },
    });
  }

  async create(data: Prisma.UsersUncheckedCreateInput) {
    return await this.prismaService.users.create({
      data,
    });
  }

  async update(userId: string, data: Prisma.UsersUncheckedUpdateInput) {
    return await this.prismaService.users.update({
      where: {
        id: userId,
      },
      data,
    });
  }

  async findOneWithCode(code: string) {
    return await this.prismaService.users.findFirst({
      where: {
        verificationCode: code,
      },
    });
  }
}
