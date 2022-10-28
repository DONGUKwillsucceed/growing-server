import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { UserDBService } from './user-db.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
@Injectable()
export class UpdateUserService {
  constructor(private readonly userDBService: UserDBService) {}

  async update(userId: string, dto: UpdateUserDto) {
    const data = this.createUserData(dto);
    return await this.userDBService.update(userId, data);
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
