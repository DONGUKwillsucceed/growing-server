import { PhotoLineDto } from '../dto/PhotoLine.dto';
import { PhotoImageUrlInterface } from '../types/PhotoInterfaces';

export class PhotoLineMapper {
  mapFromRelation(photos: PhotoImageUrlInterface[]) {
    return photos.map((photo) => {
      const dto: PhotoLineDto = {
        i: photo.id,
        u: photo.imageUrl,
        c: photo.coupleId,
        t: photo.VideoStorage ? photo.VideoStorage.time : null,
      };
      return dto;
    });
  }
}
