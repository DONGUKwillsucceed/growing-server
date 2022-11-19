import { IsString } from 'class-validator';

export class PatchCoupleDto {
  @IsString()
  anniversaryDay: string;
}
