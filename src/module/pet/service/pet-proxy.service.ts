import { Injectable } from '@nestjs/common';
import { CreatePetService } from './create-pet.service';
import { FeedPetService } from './feed-pet.service';
import { GetPetService } from './get-pet.service';
import { PatchPetService } from './patch-pet.service';
import { TouchPetService } from './touch-pet.service';

@Injectable()
export class PetProxyService {
  constructor(
    private readonly getPetService: GetPetService,
    private readonly feedPetService: FeedPetService,
    private readonly touchPetService: TouchPetService,
    private readonly patchPetService: PatchPetService,
    private readonly createPetService: CreatePetService,
  ) {}
  async findPetDto(petId: string) {
    return await this.getPetService.findPetDto(petId);
  }

  async feedAndFindReactionDto(petId: string) {
    return await this.feedPetService.actionAndFindReactionDto(petId);
  }

  async touchAndFindReactionDto(petId: string) {
    return await this.touchPetService.actionAndFindReactionDto(petId);
  }

  async patch(petId: string, name: string) {
    return await this.patchPetService.patch(petId, name);
  }

  async graduate(coupleId: string, petId: string) {
    await this.patchPetService.graduate(petId);
    const newPetId = await this.createPetService.create(coupleId);
    return this.getPetService.findPetDto(newPetId);
  }
}
