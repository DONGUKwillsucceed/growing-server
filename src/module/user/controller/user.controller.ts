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
  Put,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { PasswordDto } from '../dto/CreatePassword.dto';
import { PatchProfileImageDto } from '../dto/PatchProfileImage.dto';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { VerifyCodeDto } from '../dto/VerifyCode.dto';
import { UserProxyService } from '../service/user-proxy.service';

@ApiTags('users에 대한 Rest API')
@Controller('users')
export class UserController {
  constructor(private readonly userProxyService: UserProxyService) {}

  @Get(':userId')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  async findOne(@Param('userId') userId: string) {
    const user = await this.userProxyService.findUnique(userId);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  @Get(':userId/is-couple')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  async isCouple(@Param('userId') userId: string) {
    try {
      return await this.userProxyService.isCouple(userId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Patch(':userId/update')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  @ApiBody({ type: UpdateUserDto })
  async patch(@Param('userId') userId: string, @Body() body: any) {
    const dto = plainToInstance(UpdateUserDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    try {
      await this.userProxyService.update(userId, dto);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Put(':userId/profile-photos')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  @ApiParam({ name: 'userId', required: true })
  @ApiBody({ type: PatchProfileImageDto })
  async putProfileImage(@Req() req: UserAuthRequest) {
    const userId = req.user.id;
    const dto = plainToInstance(PatchProfileImageDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    try {
      await this.userProxyService.updateProfileImage(userId, dto.imageId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Post('codes/verify')
  @ApiBody({ type: VerifyCodeDto })
  async verify(@Req() req: UserAuthRequest) {
    const dto = plainToInstance(VerifyCodeDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    try {
      return this.userProxyService.verifyCodeAndGetPartnerId(dto.code);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Post(':userId/passwords/create')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  @ApiParam({ name: 'userId', required: true })
  @ApiBody({ type: PasswordDto })
  async lock(@Req() req: UserAuthRequest) {
    const userId = req.user.id;
    const dto = plainToInstance(PasswordDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    try {
      await this.userProxyService.createPassword(userId, dto.password);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Post(':userId/passwords/verify')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  @ApiParam({ name: 'userId', required: true })
  @ApiBody({ type: PasswordDto })
  async verifyPassword(@Req() req: UserAuthRequest) {
    const userId = req.user.id;
    const dto = plainToInstance(PasswordDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }
    try {
      return await this.userProxyService.verifyPassword(userId, dto.password);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }
}
