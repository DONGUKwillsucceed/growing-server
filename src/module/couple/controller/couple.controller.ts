import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Req,
  Delete,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { CreateCoupleAndPetDto } from '../dto/CreateCoupleAndPet.dto';
import { PatchCoupleDto } from '../dto/PatchCouple.dto';
import { CoupleProxyService } from '../service/couple-proxy.service';

@ApiTags('couples에 대한 Rest API')
@Controller('couples')
export class CoupleController {
  constructor(private readonly coupleProxyService: CoupleProxyService) {}

  @Get(':coupleId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findUnique(@Req() req: UserAuthRequest) {
    const couple = await this.coupleProxyService.findUnique(
      req.params.coupleId,
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
  async create(@Req() req: UserAuthRequest) {
    const dto = plainToInstance(CreateCoupleAndPetDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    return await this.coupleProxyService.initCouple(req.user.id, dto);
  }

  @Patch(':coupleId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: PatchCoupleDto })
  @ApiBearerAuth('jwt-token')
  async patch(@Req() req: UserAuthRequest) {
    try {
      const coupleId = req.params.coupleId;
      const dto = plainToInstance(PatchCoupleDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException(errors[0].toString());
      }
      await this.coupleProxyService.patch(coupleId, dto.anniversaryDay);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }

  @Delete(':coupleId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async remove(@Req() req: UserAuthRequest) {
    try {
      const coupleId = req.params.coupleId;
      await this.coupleProxyService.remove(coupleId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }
}
