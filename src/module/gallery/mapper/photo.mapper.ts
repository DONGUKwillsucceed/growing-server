import { PhotoDto } from '../dto/Photo.dto';
import { PhotoUserImageUrlInterface } from '../types/PhotoInterfaces';

export class PhotoMapper {
  mapFromRelation(photo: PhotoUserImageUrlInterface) {
    const dto: PhotoDto = {
      id: photo.id,
      urls: photo.imageUrl,
      createdAt: photo.createdAt,
      name: photo.Users.nickName,
    };
    return dto;
  }
}
