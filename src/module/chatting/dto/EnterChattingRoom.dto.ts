import { IsString } from 'class-validator';

export class EnterChattingRoomDto {
  @IsString()
  coupleId: string;

  @IsString()
  userId: string;
}
