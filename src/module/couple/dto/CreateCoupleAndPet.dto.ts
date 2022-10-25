import { IsDate, IsDateString, IsString } from 'class-validator';

export class CreateCoupleAndPetDto {
  @IsDateString()
  anniversaryDay: string;
  @IsString()
  petName: string;
}
