import { Injectable } from '@nestjs/common';
import { CreateCoupleAndPetDto } from '../dto/CreateCoupleAndPet.dto';
import { InitCoupleService } from './init-couple.service';

@Injectable()
export class CoupleProxyService {
  constructor(private readonly initCoupleService: InitCoupleService) {}
  async initCouple(dto: CreateCoupleAndPetDto) {
    return await this.initCoupleService.init(dto);
  }
}
