import { Injectable } from '@nestjs/common';
import { DeleteChattingService } from './delete-chatting.service';
import { GetChattingPhotoService } from './get-chatting-photo.service';
import { GetChattingService } from './get-chatting.service';

@Injectable()
export class ChattingProxyService {
  constructor(
    private readonly getChattingService: GetChattingService,
    private readonly deleteChattingService: DeleteChattingService,
    private readonly getChattingPhotoService: GetChattingPhotoService,
  ) {}
  async findMany(
    coupleId: string,
    userId: string,
    base: number,
    limit: number,
  ) {
    return await this.getChattingService.findManyForChattingDto(
      coupleId,
      userId,
      base,
      limit,
    );
  }

  async findManyForPhoto(chattingId: string) {
    return await this.getChattingPhotoService.findOneForPhotoDto(chattingId);
  }

  async removeOneForOurs(chattingId: string) {
    return await this.deleteChattingService.removeOneForOurs(chattingId);
  }

  async removeOneForMine(chattingId: string, userId: string) {
    return await this.deleteChattingService.removeOneForMine(
      chattingId,
      userId,
    );
  }
}
