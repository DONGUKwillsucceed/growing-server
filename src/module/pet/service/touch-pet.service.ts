import { Injectable } from '@nestjs/common';
import { Pets, Prisma } from '@prisma/client';
import { PetReactionDto } from '../dto/PetReaction.dto';
import { GrowPetInterface } from '../interfaces/GrowPetInterface';
import { PetInterfaceForMapping } from '../interfaces/PetInterfaces';
import { PetCareDBService } from './pet-care-db.service';
import { PetDBService } from './pet-db.service';
import { PetImageDBService } from './pet-image-db.service';

@Injectable()
export class TouchPetService implements GrowPetInterface {
  constructor(
    private readonly petCareDBService: PetCareDBService,
    private readonly petDBService: PetDBService,
    private readonly petImageDBService: PetImageDBService,
  ) {}
  /**
   *
   * action에서 터치 갯수를 올리고 터치가 3 이상인지 체크
   * 이상이면 de
   * 미만이면 in
   */
  async actionAndFindReactionDto(petId: string): Promise<PetReactionDto> {
    const result = await this.action(petId);
    let pet: Pets;
    if (result) {
      pet = await this.increasePetGauge(petId);
    } else {
      pet = await this.petDBService.findUnique(petId);
    }
    const reactionUrl = await this.getReactionImageUrl(pet.petImageId);
    const petInterface = { ...pet, reactionUrl };

    return this.mapFromRelation(petInterface);
  }

  async action(petId: string): Promise<boolean> {
    const petCare = await this.touch(petId);
    if (petCare.touchCount >= 3) {
      return false;
    }
    return true;
  }

  private async touch(petId: string) {
    const data = this.createPetCareDataForIncrease();
    return await this.petCareDBService.update(petId, data);
  }

  mapFromRelation(pet: PetInterfaceForMapping) {
    const petReactionDto: PetReactionDto = {
      petImageUrl: pet.reactionUrl,
      hungryGauge: pet.hungryGauge,
      loveGauge: pet.loveGauge,
      attentionGauge: pet.attentionGauge,
    };
    return petReactionDto;
  }

  async getReactionImageUrl(petImageId: string): Promise<string> {
    const petImage = await this.petImageDBService.getUnique(petImageId);
    return petImage.touchReactionUrl;
  }

  async increasePetGauge(petId: string): Promise<Pets> {
    const data = this.createPetDataForIncrease();
    return await this.petDBService.update(petId, data);
  }

  createPetCareDataForIncrease() {
    const data: Prisma.PetCareUpdateInput = {
      touchCount: {
        increment: 1,
      },
    };
    return data;
  }

  createPetDataForIncrease() {
    const data: Prisma.PetsUpdateInput = {
      attentionGauge: {
        increment: 2,
      },
    };
    return data;
  }
}
