import { PetCare, Pets, Prisma } from '@prisma/client';
import { PetReactionDto } from '../dto/PetReaction.dto';
import { PetInterfaceForMapping } from '../interfaces/PetInterfaces';
import { GrowPetInterface } from '../interfaces/GrowPetInterface';
import { PetCareDBService } from './pet-care-db.service';
import { PetDBService } from './pet-db.service';
import { PetImageDBService } from './pet-image-db.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedPetService implements GrowPetInterface {
  constructor(
    private readonly petCareDBService: PetCareDBService,
    private readonly petDBService: PetDBService,
    private readonly petImageDBService: PetImageDBService,
  ) {}
  async actionAndFindReactionDto(petId: string) {
    const result = await this.action(petId);
    let pet: Pets;
    if (!result) {
      pet = await this.decreasePetGauge(petId);
    } else {
      pet = await this.increasePetGauge(petId);
    }
    const reactionUrl = await this.getReactionImageUrl(pet.petImageId);

    const petInterface = { ...pet, reactionUrl };

    return this.mapFromRelation(petInterface);
  }

  async action(petId: string) {
    const hours = new Date().getUTCHours();
    if (hours > 3 && hours < 15) {
      return await this.giveDinner(petId);
    }
    return this.giveBreakfast(petId);
  }

  private async giveDinner(petId: string) {
    const petCare = await this.petCareDBService.getUnique(petId);

    if (petCare.isHaveDinner) {
      return false;
    }

    const data = this.createPetCareDataForIsHaveDinner();
    await this.petCareDBService.update(petId, data);
    return true;
  }

  private async giveBreakfast(petId: string) {
    const petCare = await this.petCareDBService.getUnique(petId);
    if (petCare.isHaveBreakfast) {
      return false;
    }

    const data = this.createPetCareDataForIsHaveBreakfast();
    await this.petCareDBService.update(petId, data);
    return true;
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

  async getReactionImageUrl(petImageId: string) {
    const petImage = await this.petImageDBService.getUnique(petImageId);
    return petImage.eatReactionUrl;
  }

  async increasePetGauge(petId: string) {
    return await this.petDBService.increaseOneHungryGauge(petId);
  }
  async decreasePetGauge(petId: string) {
    return await this.petDBService.decreaseOneHungryGuage(petId);
  }

  createPetCareDataForIsHaveBreakfast() {
    const data: Prisma.PetCareUpdateInput = {
      isHaveBreakfast: 1,
    };
    return data;
  }

  createPetCareDataForIsHaveDinner() {
    const data: Prisma.PetCareUpdateInput = {
      isHaveDinner: 1,
    };
    return data;
  }
}
