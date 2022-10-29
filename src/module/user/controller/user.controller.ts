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
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { VerifyCodeDto } from '../dto/VerifyCode.dto';
import { UserProxyService } from '../service/user-proxy.service';

@Controller('users')
export class UserController {
  constructor(private readonly userProxyService: UserProxyService) {}

  @Get(':userId')
  @UseGuards(UserAuthGuard)
  async findOne(@Param('userId') userId: string) {
    const user = await this.userProxyService.findUnique(userId);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  @Get(':userId/is-couple')
  @UseGuards(UserAuthGuard)
  async isCouple(@Param('userId') userId: string) {
    return await this.userProxyService.isCouple(userId);
  }

  @Patch(':userId/update')
  @UseGuards(UserAuthGuard)
  async patch(@Param('userId') userId: string, @Body() body: any) {
    const dto = plainToInstance(UpdateUserDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    await this.userProxyService.update(userId, dto);
  }

  @Post('codes/verify')
  async verify(@Req() req: UserAuthRequest) {
    const dto = plainToInstance(VerifyCodeDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    return this.userProxyService.verifyCodeAndGetPartnerId(dto.code);
  }
}
