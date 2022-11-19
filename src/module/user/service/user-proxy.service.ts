import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { GetUserService } from './get-user.service';
import { UpdateUserService } from './update-user.service';
import { UserCodeService } from './user-code.service';

@Injectable()
export class UserProxyService {
  constructor(
    private readonly userCodeService: UserCodeService,
    private readonly getUserService: GetUserService,
    private readonly updateUserService: UpdateUserService,
  ) {}

  async findUnique(userId: string) {
    return await this.getUserService.findUserDto(userId);
  }

  async isCouple(userId: string) {
    const user = await this.getUserService.findUserDto(userId);
    const result = !!user.coupleId;
    return { result };
  }

  async update(userId: string, dto: UpdateUserDto) {
    return this.updateUserService.update(userId, dto);
  }

  async updateProfileImage(userId: string, imageId: string) {
    return this.updateUserService.updateProfile(userId, imageId);
  }

  async verifyCodeAndGetPartnerId(code: string) {
    const user = await this.userCodeService.verify(code);
    return { partnerId: user.id };
  }
}
