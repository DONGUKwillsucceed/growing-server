import { PetCare, PetImages, Pets } from '@prisma/client';

export interface PetInterfaceForMapping extends Pets {
  reactionUrl: string;
  petCare: PetCare;
}

export interface PetImageInterface extends Pets {
  PetImages: PetImages;
}
