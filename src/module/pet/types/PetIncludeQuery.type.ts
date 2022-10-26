import { PetCare, PetImages, Pets } from '@prisma/client';

export type PetIncludeQueryType = Pets & {
  PetCare: PetCare;
  PetImages: PetImages;
};
