import { AlbumDto } from '../dto/Album.dto';
import { AlbumPhotoImageUrlInterface } from '../types/AlbumInterface';

export class AlbumMapper {
  mapFromRelationForMany(albums: AlbumPhotoImageUrlInterface[]) {
    return albums.map((album) => {
      const dto: AlbumDto = {
        id: album.id,
        imageUrl: album.imageUrl,
        createdAt: album.createdAt,
        title: album.title,
        subTitle: album.subHead,
      };
      return dto;
    });
  }
}
