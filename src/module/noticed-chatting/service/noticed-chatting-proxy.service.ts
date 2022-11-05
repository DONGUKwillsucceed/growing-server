import { Injectable } from '@nestjs/common';
import { GetChattingService } from './get-chatting.service';
import { NotifyChattingService } from './notify-chatting.service';
@Injectable()
export class NoticedChattingProxyService {
  constructor(
    private readonly notifyChattingService: NotifyChattingService,
    private readonly getChattingService: GetChattingService,
  ) {}
  async notify(coupleId: string, chattingId: string, userId: string) {
    await this.notifyChattingService.notify(coupleId, chattingId, userId);
  }

  async findOne(userId: string) {
    return await this.getChattingService.findOne(userId);
  }
}
