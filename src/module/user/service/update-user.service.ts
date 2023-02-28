import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { UserDBService } from './user-db.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
@Injectable()
export class UpdateUserService {
  constructor(
    private readonly userDBService: UserDBService,
    private readonly prismaService: PrismaService,
  ) {}

  async update(userId: string, dto: UpdateUserDto) {
    const data = this.createUserData(dto);
    return await this.userDBService.update(userId, data);
  }

  async updateProfile(userId: string, imageId: string) {
    await this.prismaService.users.update({
      where: { id: userId },
      data: { profileId: imageId, modifiedAt: new Date() },
    });
  }

  async updatePassword(userId: string, password: string) {
    await this.prismaService.users.update({
      where: { id: userId },
      data: { password, modifiedAt: new Date() },
    });
  }

  createUserData(dto: UpdateUserDto) {
    const data: Prisma.UsersUpdateInput = {
      nickName: dto.nickName,
      birthDay: new Date(dto.birthDay),
      modifiedAt: new Date(),
    };
    return data;
  }
}
