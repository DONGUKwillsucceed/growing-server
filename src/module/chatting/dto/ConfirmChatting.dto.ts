import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmChattingDto {
  @ApiProperty({ description: '커플 id' })
  @IsString()
  coupleId: string;

  @ApiProperty({ description: '사용자 id' })
  @IsString()
  userId: string;
}
