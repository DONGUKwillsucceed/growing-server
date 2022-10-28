import { Pets } from '@prisma/client';

export interface PetInterfaceForMapping extends Pets {
  reactionUrl: string;
}
