import { Injectable } from '@nestjs/common';
import { UserDto } from '../dto/User.dto';
import {
  UserCoupleImageUrlInterface,
  UserCoupleInterface,
} from '../types/User.interface';

@Injectable()
export class UserMapperService {
  mapUserDto(user: UserCoupleImageUrlInterface) {
    const { id, name, nickName, birthDay, coupleId, Couples, imageUrl } = user;
    let anniversaryDay: Date | null = null;
    if (coupleId) {
      anniversaryDay = Couples.anniversaryDay;
    }
    const userDto: UserDto = {
      id,
      name,
      nickName,
      birthDay,
      coupleId,
      anniversaryDay,
      imageUrl,
    };
    return userDto;
  }
}
