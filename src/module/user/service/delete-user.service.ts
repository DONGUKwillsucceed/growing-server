import { Injectable } from '@nestjs/common';
import { UserDBService } from './user-db.service';

@Injectable()
export class DeleteUserService {
  constructor(private readonly userDBService: UserDBService) {}

  async execute(userId: string) {
    await this.userDBService.remove(userId);
  }
}
