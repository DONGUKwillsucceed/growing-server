import { Injectable } from '@nestjs/common';
import { PetDto } from '../dto/Pet.dto';
import { PetIncludeQueryType } from '../types/PetIncludeQuery.type';
import { PetDBService } from './pet-db.service';
@Injectable()
export class GetPetService {
  constructor(private readonly petDBService: PetDBService) {}

  async findPetDto(petId: string) {
    return await this.petDBService
      .findUnique(petId)
      .then((pet) => this.mapFromRelation(pet));
  }

  mapFromRelation(pet: PetIncludeQueryType) {
    const petDto: PetDto = {
      petId: pet.id,
      name: pet.name,
      imageUrl: pet.PetImages.normalReactionUrl,
      hungryGauge: pet.hungryGauge,
      attentionGauge: pet.attentionGauge,
      loveGauge: pet.loveGauge,
    };
    return petDto;
  }
}
