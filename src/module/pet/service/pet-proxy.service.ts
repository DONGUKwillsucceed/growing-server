import { Injectable } from '@nestjs/common';
import { GetPetService } from './get-pet.service';

@Injectable()
export class PetProxyService {
  constructor(private readonly getPetService: GetPetService) {}
  async findPetDto(petId: string) {
    return await this.getPetService.findPetDto(petId);
  }
}
