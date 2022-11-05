import { Injectable } from '@nestjs/common';
import { NotifyChattingService } from './notify-chatting.service';
@Injectable()
export class NoticedChattingProxyService {
  constructor(private readonly notifyChattingService: NotifyChattingService) {}
  async notify(coupleId: string, chattingId: string, userId: string) {
    await this.notifyChattingService.notify(coupleId, chattingId, userId);
  }
}
