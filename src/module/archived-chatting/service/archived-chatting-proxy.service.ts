import { ArchiveChattingService } from './archive-chatting.service';
import { Injectable } from '@nestjs/common';
import { UnStoreChattingService } from './unstore-chatting.service';

@Injectable()
export class ArchivedChattingProxyService {
  constructor(
    private readonly archiveChattingService: ArchiveChattingService,
    private readonly unstoreChattingService: UnStoreChattingService,
  ) {}

  async archive(coupleId: string, userId: string, chattingId: string) {
    await this.archiveChattingService.archive(coupleId, userId, chattingId);
  }

  async unstore(chattingId: string) {
    await this.unstoreChattingService.unstore(chattingId);
  }
}
