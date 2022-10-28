import { IsDateString, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsDateString()
  birthDay: string;

  @IsString()
  nickName: string;
}
