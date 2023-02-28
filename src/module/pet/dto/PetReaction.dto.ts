import { PetCare } from '@prisma/client';

export interface PetReactionDto {
  petImageUrl: string;
  hungryGauge: number;
  talkingBox: string | null;
  attentionGauge: number;
  loveGauge: number;
  petCare: PetCare;
}
