import { IsString, IsEnum, IsDateString } from 'class-validator';
import { Gender } from '../types/Gender.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  nickName: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsDateString()
  birthDay: Date;
}
