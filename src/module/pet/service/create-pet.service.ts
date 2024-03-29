import { Injectable } from '@nestjs/common';
import { Pets, Prisma } from '@prisma/client';
import { PetCareDBService } from './pet-care-db.service';
import { PetDBService } from './pet-db.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreatePetService {
  constructor(
    private readonly petDBService: PetDBService,
    private readonly petCareDBService: PetCareDBService,
  ) {}

  async create(coupleId: string, pet: Pets) {
    const petCare = await this.petCareDBService.create(
      this.createPetCareData(),
    );
    let newPet: Prisma.PetsUncheckedCreateInput;
    while (true) {
      newPet = this.createPetData(coupleId, petCare.id);
      if (newPet.petImageId != pet.petImageId) break;
    }
    const { id } = await this.petDBService.create(newPet);
    return id;
  }

  private createPetData(coupleId: string, careId: string) {
    const data: Prisma.PetsUncheckedCreateInput = {
      id: careId,
      name: '',
      careId,
      coupleId,
      petImageId: String(Math.floor(Math.random() * 3) + 1),
    };
    return data;
  }

  private createPetCareData() {
    const data: Prisma.PetCareUncheckedCreateInput = {
      id: uuidv4(),
    };
    return data;
  }
}
