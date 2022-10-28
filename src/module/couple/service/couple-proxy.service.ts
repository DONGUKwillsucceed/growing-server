import { Injectable } from '@nestjs/common';
import { CreateCoupleAndPetDto } from '../dto/CreateCoupleAndPet.dto';
import { GetCoupleService } from './get-couple.service';
import { InitCoupleService } from './init-couple.service';

@Injectable()
export class CoupleProxyService {
  constructor(
    private readonly initCoupleService: InitCoupleService,
    private readonly getCoupleService: GetCoupleService,
  ) {}
  async initCouple(userId: string, dto: CreateCoupleAndPetDto) {
    return await this.initCoupleService.init(userId, dto);
  }

  async findUnique(coupleId: string, userId: string) {
    return await this.getCoupleService.findCoupleDto(coupleId, userId);
  }
}
