import { Pets, Prisma } from '@prisma/client';
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
    const petCare = await this.petCareDBService.getUnique(petId);

    const petInterface = { ...pet, reactionUrl, petCare };

    return this.mapFromRelation(petInterface);
  }

  async action(petId: string) {
    const hours = new Date().getUTCHours();
    if (hours > 3 && hours < 15) {
      return await this.giveDinner(petId);
    }
    return await this.giveBreakfast(petId);
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
      talkingBox: null,
      loveGauge: pet.loveGauge,
      attentionGauge: pet.attentionGauge,
      petCare: pet.petCare,
    };
    return petReactionDto;
  }

  async getReactionImageUrl(petImageId: string) {
    const petImage = await this.petImageDBService.getUnique(petImageId);
    return petImage.eatReactionUrl;
  }

  async increasePetGauge(petId: string) {
    const data = this.createPetDataForIncrease();
    return await this.petDBService.update(petId, data);
  }
  async decreasePetGauge(petId: string) {
    const pet = await this.petDBService.findUnique(petId);
    if (pet.hungryGauge <= 0) return pet;
    const data = this.createPetDataForDecrease();
    return await this.petDBService.update(petId, data);
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

  createPetDataForIncrease() {
    const data: Prisma.PetsUpdateInput = {
      hungryGauge: {
        increment: 2,
      },
    };
    return data;
  }

  createPetDataForDecrease() {
    const data: Prisma.PetsUpdateInput = {
      hungryGauge: {
        decrement: 2,
      },
    };
    return data;
  }
}
