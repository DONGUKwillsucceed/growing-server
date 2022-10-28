import { Prisma } from '@prisma/client';
import { CreateCoupleAndPetDto } from '../dto/CreateCoupleAndPet.dto';
import { v4 as uuidv4 } from 'uuid';
import { CoupleDBService } from './couple-db.service';
import { Injectable } from '@nestjs/common';
import { PetDBService } from './pet-db.service';
import { PetCareDBService } from './pet-care-db.service';
@Injectable()
export class InitCoupleService {
  constructor(
    private readonly coupleDBService: CoupleDBService,
    private readonly petDBService: PetDBService,
    private readonly petCareDBService: PetCareDBService,
  ) {}
  async init(dto: CreateCoupleAndPetDto) {
    const couple = await this.coupleDBService.create(
      this.createCoupleData(dto.anniversaryDay),
    );
    const petCare = await this.petCareDBService.create(
      this.createPetCareData(),
    );
    await this.petDBService.create(this.createPetData(couple.id, petCare.id));

    return couple;
  }

  private createPetCareData() {
    const data: Prisma.PetCareUncheckedCreateInput = {
      id: uuidv4(),
    };
    return data;
  }

  private createPetData(coupleId: string, careId: string) {
    const data: Prisma.PetsUncheckedCreateInput = {
      id: careId,
      name: '',
      careId,
      coupleId,
      petImageId: '1',
    };
    return data;
  }

  private createCoupleData(anniversaryDay: string) {
    const data: Prisma.CouplesUncheckedCreateInput = {
      id: uuidv4(),
      anniversaryDay: new Date(anniversaryDay),
    };
    return data;
  }
}
