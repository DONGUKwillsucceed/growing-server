export interface PetDto {
  petId: string;
  name: string | null;
  imageUrl: string;
  hungryGauge: number;
  attentionGauge: number;
  loveGauge: number;
}
