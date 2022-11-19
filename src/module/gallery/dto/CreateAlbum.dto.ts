import { IsArray, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  title: string;

  @IsString()
  subTitle: string;

  @IsArray()
  imageIds: string[];
}
