import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { CreateCoupleAndPetDto } from '../dto/CreateCoupleAndPet.dto';
import { CoupleProxyService } from '../service/couple-proxy.service';

@Controller('couples')
export class CoupleController {
  constructor(private readonly coupleProxyService: CoupleProxyService) {}

  @Get(':coupleId')
  async findUnique(
    @Param('coupleId') coupleId: string,
    @Req() req: UserAuthRequest,
  ) {
    const couple = await this.coupleProxyService.findUnique(
      coupleId,
      '10509d8b-7aac-44c3-bc4d-8dcde71f0929',
    );
    if (!couple) {
      throw new NotFoundException('Couple not found');
    }
    return couple;
  }

  @Post('create')
  async create(@Body() body: any) {
    const dto = plainToInstance(CreateCoupleAndPetDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    return await this.coupleProxyService.initCouple(dto);
  }
}
