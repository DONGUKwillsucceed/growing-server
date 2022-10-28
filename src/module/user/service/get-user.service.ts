import { UserDto } from '../dto/User.dto';
import { UserCoupleImageUrlInterface } from '../types/User.interface';
import { UserDBService } from './user-db.service';
import { UserS3Service } from './user-s3.service';

export class GetUserService {
  constructor(
    private readonly userDBService: UserDBService,
    private readonly userS3Service: UserS3Service,
  ) {}
  async findUserDto(userId: string) {
    return await this.userDBService
      .getUnique(userId)
      .then((user) => this.userS3Service.getImageUrl(user))
      .then((user) => this.mapFromRelation(user));
  }

  mapFromRelation(user: UserCoupleImageUrlInterface) {
    const { id, nickName, birthDay, coupleId, Couples, imageUrl } = user;
    let anniversaryDay: Date | null = null;
    if (coupleId) {
      anniversaryDay = Couples.anniversaryDay;
    }
    const userDto: UserDto = {
      id,
      nickName,
      birthDay,
      coupleId,
      anniversaryDay,
      imageUrl,
    };
    return userDto;
  }
}
