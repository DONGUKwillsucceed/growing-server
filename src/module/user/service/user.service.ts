import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { UserDBService } from './user-db.service';
import { UserMapperService } from './user-map.service';
import { UserS3Service } from './user-s3.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { UserCodeService } from './user-code.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userDBService: UserDBService,
    private readonly userMapper: UserMapperService,
    private readonly userS3Service: UserS3Service,
    private readonly userCodeService: UserCodeService,
  ) {}

  async findUserWithCode(code: string) {}

  async findOne(userId: string) {
    return await this.userDBService
      .getUnique(userId)
      .then((user) => this.userS3Service.getImageUrl(user))
      .then((user) => this.userMapper.mapUserDto(user));
  }

  async create(dto: CreateUserDto) {
    const code = await this.userCodeService.generateOne();
    const data = this.createUserData(dto, code);
    return await this.userDBService.create(data);
  }

  async update(userId: string, dto: UpdateUserDto) {
    const data = this.createUserUpdateData(dto);
    return await this.userDBService.update(userId, data);
  }

  async isCouple(userId: string) {
    const { Couples } = await this.userDBService.getUnique(userId);
    if (Couples) {
      return { result: true };
    }

    return { result: false };
  }

  private createUserUpdateData(dto: UpdateUserDto) {
    const { nickName, birthDay } = dto;
    const data: Prisma.UsersUncheckedUpdateInput = {
      nickName: nickName,
      birthDay: new Date(birthDay),
      modifiedAt: new Date(),
    };
    return data;
  }

  private createUserData(dto: CreateUserDto, code: string) {
    const { nickName, gender, birthDay } = dto;
    const data: Prisma.UsersUncheckedCreateInput = {
      id: uuidv4(),
      nickName,
      gender,
      birthDay: new Date(birthDay),
      verificationCode: code,
    };
    return data;
  }
}
