import { Injectable } from '@nestjs/common';
import { DeleteChattingService } from './delete-chatting.service';
import { GetChattingService } from './get-chatting.service';

@Injectable()
export class ChattingProxyService {
  constructor(
    private readonly getChattingService: GetChattingService,
    private readonly deleteChattingService: DeleteChattingService,
  ) {}
  async findMany(coupleId: string, userId: string) {
    return await this.getChattingService.findManyForChattingDto(
      coupleId,
      userId,
    );
  }

  async removeOneForOurs(chattingId: string) {
    return await this.deleteChattingService.removeOneForOurs(chattingId);
  }

  async removeOneForMine(chattingId: string, userId: string) {
    return this.deleteChattingService.removeOneForMine(chattingId, userId);
  }
}
