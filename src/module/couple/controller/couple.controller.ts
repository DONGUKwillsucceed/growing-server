import {
  Body,
  Param,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Req,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { CreateCoupleAndPetDto } from '../dto/CreateCoupleAndPet.dto';
import { PatchCoupleDto } from '../dto/PatchCouple.dto';
import { CoupleProxyService } from '../service/couple-proxy.service';

@ApiTags('couples에 대한 Rest API')
@Controller('couples')
@UseFilters(HttpExceptionFilter)
export class CoupleController {
  constructor(private readonly coupleProxyService: CoupleProxyService) {}

  @Get(':coupleId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findUnique(
    @Req() req: UserAuthRequest,
    @Param('coupleId') coupleId: string,
  ) {
    const couple = await this.coupleProxyService.findUnique(
      coupleId,
      req.user.id,
    );
    if (!couple) {
      throw new NotFoundException('Couple not found');
    }
    return couple;
  }

  @Post('create')
  @ApiBody({ type: CreateCoupleAndPetDto })
  @ApiBearerAuth('jwt-token')
  async create(
    @Req() req: UserAuthRequest,
    @Body(ValidationPipe) dto: CreateCoupleAndPetDto,
  ) {
    return await this.coupleProxyService.initCouple(req.user.id, dto);
  }

  @Patch(':coupleId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: PatchCoupleDto })
  @ApiBearerAuth('jwt-token')
  async patch(
    @Param('coupleId') coupleId: string,
    @Body(ValidationPipe) dto: PatchCoupleDto,
  ) {
    await this.coupleProxyService.patch(coupleId, dto.anniversaryDay);
  }

  @Delete(':coupleId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async remove(@Param('coupleId') coupleId: string) {
    await this.coupleProxyService.remove(coupleId);
  }
}
