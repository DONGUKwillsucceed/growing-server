import { Pets } from '@prisma/client';
import { PetReactionDto } from '../dto/PetReaction.dto';
import { PetInterfaceForMapping } from './PetInterfaces';

export interface GrowPetInterface {
  actionAndFindReactionDto(petId: string): Promise<any>;

  action(petId: string): Promise<any>;

  mapFromRelation(pet: PetInterfaceForMapping): PetReactionDto;

  getReactionImageUrl(petId: string): Promise<string>;

  increasePetGauge(petId: string): Promise<Pets>;

  decreasePetGauge(petId: string): Promise<Pets>;
}
