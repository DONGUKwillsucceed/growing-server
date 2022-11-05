import { Injectable } from '@nestjs/common';
import { GetChattingService } from './get-chatting.service';
import { NotifyChattingService } from './notify-chatting.service';
import { RemoveChattingService } from './remove-chatting.service';
@Injectable()
export class NoticedChattingProxyService {
  constructor(
    private readonly notifyChattingService: NotifyChattingService,
    private readonly getChattingService: GetChattingService,
    private readonly removeChattingService: RemoveChattingService,
  ) {}
  async notify(coupleId: string, chattingId: string, userId: string) {
    await this.notifyChattingService.notify(coupleId, chattingId, userId);
  }

  async findOne(userId: string) {
    return await this.getChattingService.findOne(userId);
  }

  async foldOrUnFold(userId: string, coupleId: string) {
    return await this.removeChattingService.foldOrUnFold(userId, coupleId);
  }
}
