import { ArchiveChattingService } from './archive-chatting.service';
import { Injectable } from '@nestjs/common';
import { UnStoreChattingService } from './unstore-chatting.service';
import { GetArchivedChattingService } from './get-archived-chatting.service';

@Injectable()
export class ArchivedChattingProxyService {
  constructor(
    private readonly archiveChattingService: ArchiveChattingService,
    private readonly unstoreChattingService: UnStoreChattingService,
    private readonly getArchivedChattingService: GetArchivedChattingService,
  ) {}

  async archive(coupleId: string, userId: string, chattingId: string) {
    await this.archiveChattingService.archive(coupleId, userId, chattingId);
  }

  async unstore(chattingId: string) {
    await this.unstoreChattingService.unstore(chattingId);
  }

  async findMany(coupleId: string) {
    return await this.getArchivedChattingService.findMany(coupleId);
  }
}
