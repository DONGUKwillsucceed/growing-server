import {
  Controller,
  Param,
  NotFoundException,
  Get,
  Patch,
  Body,
  Post,
  Req,
  UseGuards,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { USER_NOT_FOUND } from '../const';
import { PasswordDto } from '../dto/CreatePassword.dto';
import { PatchProfileImageDto } from '../dto/PatchProfileImage.dto';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { VerifyCodeDto } from '../dto/VerifyCode.dto';
import { UserProxyService } from '../service/user-proxy.service';

@ApiTags('users에 대한 Rest API')
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userProxyService: UserProxyService) {}

  @Get(':userId')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  async findOne(@Param('userId') userId: string) {
    const user = await this.userProxyService.findUnique(userId);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return user;
  }

  @Get(':userId/is-couple')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  async isCouple(@Param('userId') userId: string) {
    return await this.userProxyService.isCouple(userId);
  }

  @Patch(':userId/update')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  @ApiBody({ type: UpdateUserDto })
  async patch(
    @Param('userId') userId: string,
    @Body(ValidationPipe) dto: UpdateUserDto,
  ) {
    await this.userProxyService.update(userId, dto);
  }

  @Put(':userId/profile-photos')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  @ApiParam({ name: 'userId', required: true })
  @ApiBody({ type: PatchProfileImageDto })
  async putProfileImage(
    @Req() req: UserAuthRequest,
    @Body(ValidationPipe) dto: PatchProfileImageDto,
  ) {
    const userId = req.user.id;
    await this.userProxyService.updateProfileImage(userId, dto.imageId);
  }

  @Post('codes/verify')
  @ApiBody({ type: VerifyCodeDto })
  async verify(@Body(ValidationPipe) dto: VerifyCodeDto) {
    return this.userProxyService.verifyCodeAndGetPartnerId(dto.code);
  }

  @Post(':userId/passwords/create')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  @ApiParam({ name: 'userId', required: true })
  @ApiBody({ type: PasswordDto })
  async lock(
    @Req() req: UserAuthRequest,
    @Body(ValidationPipe) dto: PasswordDto,
  ) {
    const userId = req.user.id;
    await this.userProxyService.createPassword(userId, dto.password);
  }

  @Post(':userId/passwords/verify')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('jwt-token')
  @ApiParam({ name: 'userId', required: true })
  @ApiBody({ type: PasswordDto })
  async verifyPassword(
    @Req() req: UserAuthRequest,
    @Body(ValidationPipe) dto: PasswordDto,
  ) {
    const userId = req.user.id;
    return await this.userProxyService.verifyPassword(userId, dto.password);
  }
}
