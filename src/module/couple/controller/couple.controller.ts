import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateCoupleService } from '../service/couple.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCoupleAndPetDto } from '../dto/CreateCoupleAndPet.dto';

@Controller('couples')
export class CoupleController {
  constructor(private readonly createCoupleService: CreateCoupleService) {}
  @Post('create')
  async create(@Body() body: any) {
    const dto = plainToInstance(CreateCoupleAndPetDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    return await this.createCoupleService.createCoupleAndPet(dto);
  }
}
