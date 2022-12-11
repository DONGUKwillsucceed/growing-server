import { IsString } from 'class-validator';

export class CreateVoiceMesageDto {
  @IsString()
  s3Path: string;
  @IsString()
  chattingId: string;

  time: string;
}
