import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreatePhotoRequestDto {
  @IsString()
  s3Path: string;

  @IsNumber()
  time: number;
}
