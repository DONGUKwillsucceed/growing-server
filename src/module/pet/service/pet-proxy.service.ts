import { Injectable } from '@nestjs/common';
import { FeedPetService } from './feed-pet.service';
import { GetPetService } from './get-pet.service';

@Injectable()
export class PetProxyService {
  constructor(
    private readonly getPetService: GetPetService,
    private readonly feedPetService: FeedPetService,
  ) {}
  async findPetDto(petId: string) {
    return await this.getPetService.findPetDto(petId);
  }

  async feedAndFindReactionDto(petId: string) {
    return await this.feedPetService.actionAndFindReactionDto(petId);
  }
}
