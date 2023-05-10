import { IsDateString, IsString } from 'class-validator';

export class CreateCoupleAndPetDto {
  @IsDateString()
  anniversaryDay: string;

  @IsString()
  partnerId: string;
}
