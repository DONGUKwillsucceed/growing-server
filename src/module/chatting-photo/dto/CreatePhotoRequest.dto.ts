import { IsEnum, IsString } from 'class-validator';
import { Type } from '../types/Type';

export class CreatePhotoRequestDto {
  @IsString()
  s3Path: string;

  @IsEnum(Type)
  type: Type;
}
