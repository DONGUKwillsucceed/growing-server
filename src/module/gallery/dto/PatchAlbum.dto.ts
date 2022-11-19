import { IsOptional, IsString } from 'class-validator';

export class PatchAlbumDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subTitle?: string;
}
