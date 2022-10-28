import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { UserDBService } from './user-db.service';

export class UpdateUserService {
  constructor(private readonly userDBService: UserDBService) {}

  async update(userId: string, dto: UpdateUserDto) {
    return await this.userDBService.update(userId, dto);
  }
}
