import { ChattingDBService } from './chatting-db.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteChattingService {
  constructor(private readonly chattingDBService: ChattingDBService) {}

  async removeOneForOurs(chattingId: string) {
    return await this.chattingDBService.updateOneForIsDeletedWithChattingId(
      chattingId,
    );
  }

  async removeOneForMine(chattingId: string, userId: string) {
    return await this.chattingDBService.updateOneForIsDeletedWithChattingIdAndUserId(
      chattingId,
      userId,
    );
  }
}
