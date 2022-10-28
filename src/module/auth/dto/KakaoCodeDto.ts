import { IsString } from 'class-validator';

export class KakaoCodeDto {
  @IsString()
  code: string;
}
