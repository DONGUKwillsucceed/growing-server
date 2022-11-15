import { IsString } from 'class-validator';

export class UploadUrlRequestDto {
  @IsString()
  name: string;
}
