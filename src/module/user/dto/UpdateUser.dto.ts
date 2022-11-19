import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsDateString()
  @IsOptional()
  birthDay?: string;

  @IsString()
  @IsOptional()
  nickName?: string;
}
