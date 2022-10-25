import { Prisma } from '@prisma/client';
import { CreateCoupleAndPetDto } from '../dto/CreateCoupleAndPet.dto';
import { v4 as uuidv4 } from 'uuid';
import { CoupleDBService } from './couple-db.service';
import { Injectable } from '@nestjs/common';
import { CoupleCodeService } from './couple-code.service';
import { PetDBService } from './pet-db.service';
import { PetCareDBService } from './pet-care-db.service';
@Injectable()
export class InitCoupleService {
  constructor(
    private readonly coupleDBService: CoupleDBService,
    private readonly petDBService: PetDBService,
    private readonly petCareDBService: PetCareDBService,
    private readonly coupleCodeService: CoupleCodeService,
  ) {}
  async init(dto: CreateCoupleAndPetDto) {
    const code = await this.coupleCodeService.generateOne();
    const couple = await this.coupleDBService.create(
      this.createCoupleData(dto.anniversaryDay, code),
    );
    const petCare = await this.petCareDBService.create(
      this.createPetCareData(),
    );
    await this.petDBService.create(
      this.createPetData(dto.petName, couple.id, petCare.id),
    );

    return couple;
  }

  private createPetCareData() {
    const data: Prisma.PetCareUncheckedCreateInput = {
      id: uuidv4(),
    };
    return data;
  }

  private createPetData(name: string, coupleId: string, careId: string) {
    const data: Prisma.PetsUncheckedCreateInput = {
      id: uuidv4(),
      name,
      careId,
      coupleId,
      petImageId: '1',
    };
    return data;
  }

  private createCoupleData(anniversaryDay: string, code: string) {
    const data: Prisma.CouplesUncheckedCreateInput = {
      id: uuidv4(),
      anniversaryDay: new Date(anniversaryDay),
      verificationCode: code,
    };
    return data;
  }
}
