import { Injectable } from '@nestjs/common';
import { CoupleDto } from '../dto/Couple.dto';
import { CoupleIncludeQueryType } from '../types/CoupleIncludeQuery.type';
import { CoupleDBService } from './couple-db.service';

@Injectable()
export class GetCoupleService {
  constructor(private readonly coupleDBService: CoupleDBService) {}

  async findCoupleDto(coupleId: string, userId: string) {
    return await this.coupleDBService
      .findUnique(coupleId)
      .then((couple) => this.mapFromRelation(couple, userId));
  }

  mapFromRelation(couple: CoupleIncludeQueryType, userId: string) {
    const dayCount = new Date().getTime() - couple.anniversaryDay.getTime();
    const myName = couple.Users.find((user) => user.id === userId).name;
    const partnerName = couple.Users.find((user) => user.id !== userId).name;

    const coupleDto: CoupleDto = {
      coupleId: couple.id,
      myName,
      partnerName,
      dayCount,
      petId: couple.Pets[0].id,
    };

    return coupleDto;
  }
}