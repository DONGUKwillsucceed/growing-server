import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCoupleAndPetDto } from '../dto/CreateCoupleAndPet.dto';
import { CoupleProxyService } from '../service/couple-proxy.service';

@Controller('couples')
export class CoupleController {
  constructor(private readonly coupleProxyService: CoupleProxyService) {}
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
