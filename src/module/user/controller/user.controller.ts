import {
  Controller,
  Param,
  NotFoundException,
  Get,
  Patch,
  Body,
  BadRequestException,
  Post,
  Req,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { VerifyCodeDto } from '../dto/VerifyCode.dto';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  @Get(':userId/is-couple')
  async isCouple(@Param('userId') userId: string) {
    return await this.userService.isCouple(userId);
  }

  @Patch(':userId/update')
  async patch(@Param('userId') userId: string, @Body() body: any) {
    const dto = plainToInstance(UpdateUserDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    return await this.userService.update(userId, dto);
  }

  @Post('create')
  async create(@Body() body: any) {
    const dto = plainToInstance(CreateUserDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    return await this.userService.create(dto);
  }

  @Post('codes/verify')
  async verify(@Req() req: UserAuthRequest) {
    const dto = plainToInstance(VerifyCodeDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }
  }
}
