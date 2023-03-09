import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Type } from '../types/Type';

export class CreatePhotoRequestDto {
  @IsString()
  s3Path: string;

  @IsNumber()
  time: number;
}
