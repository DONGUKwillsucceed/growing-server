import { PetImages, Pets } from '@prisma/client';

export interface PetInterfaceForMapping extends Pets {
  reactionUrl: string;
}

export interface PetImageInterface extends Pets {
  PetImages: PetImages;
}
