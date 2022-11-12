import { IsString } from 'class-validator';

export class GetUploadUrlRequestDto {
  @IsString()
  name: string;
}
