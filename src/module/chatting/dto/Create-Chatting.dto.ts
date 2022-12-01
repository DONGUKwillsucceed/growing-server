import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateChattingDto {
  @IsString()
  @IsOptional()
  content: string | null;

  @IsString()
  @IsOptional()
  emojiId: string | null;

  @IsString()
  @IsArray()
  imageS3Pathes: string[]; // 사진, 비디오

  @IsString()
  @IsArray()
  voiceMsgS3Pathes: string[];

  @IsString()
  userId: string;

  @IsString()
  coupleId: string;
}
