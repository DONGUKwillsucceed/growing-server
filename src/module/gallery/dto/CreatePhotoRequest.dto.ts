import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePhotoRequestDto {
  @IsString()
  s3Path: string;

  @IsNumber()
  @IsOptional()
  time: number | null;
}
