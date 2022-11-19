import { Injectable } from '@nestjs/common';
import { CreateCoupleAndPetDto } from '../dto/CreateCoupleAndPet.dto';
import { GetCoupleService } from './get-couple.service';
import { InitCoupleService } from './init-couple.service';
import { PatchCoupleService } from './patch-couple.service';
import { RemoveCoupleService } from './remove-couple.service';

@Injectable()
export class CoupleProxyService {
  constructor(
    private readonly initCoupleService: InitCoupleService,
    private readonly getCoupleService: GetCoupleService,
    private readonly patchCoupleService: PatchCoupleService,
    private readonly removeCoupleService: RemoveCoupleService,
  ) {}
  async initCouple(userId: string, dto: CreateCoupleAndPetDto) {
    return await this.initCoupleService.init(userId, dto);
  }

  async findUnique(coupleId: string, userId: string) {
    return await this.getCoupleService.findCoupleDto(coupleId, userId);
  }

  async patch(coupleId: string, anniversaryDay: string) {
    await this.patchCoupleService.patch(coupleId, anniversaryDay);
  }

  async remove(coupleId: string) {
    await this.removeCoupleService.remove(coupleId);
  }
}
