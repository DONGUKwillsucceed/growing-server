import { PhotoDto } from '../dto/Photo.dto';
import { PhotoUserVideoImageUrlInterface } from '../types/PhotoInterfaces';

export class PhotoMapper {
  mapFromRelation(photo: PhotoUserVideoImageUrlInterface) {
    const dto: PhotoDto = {
      id: photo.id,
      urls: photo.imageUrl,
      videoUrl: photo.videoUrl,
      createdAt: photo.createdAt,
      name: photo.Users.nickName,
      time: photo.VideoStorage ? photo.VideoStorage.time : null,
    };
    return dto;
  }
}
