import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateChattingDto {
  @IsString()
  @IsOptional()
  content: string | null;

  @IsString()
  @IsOptional()
  emojiId: string | null;

  @IsArray()
  imageIds: string[]; // 사진, 비디오

  @IsArray()
  voiceMsgIds: string[];

  @IsString()
  userId: string;

  @IsString()
  coupleId: string;
}
