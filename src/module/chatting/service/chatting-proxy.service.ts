import { Injectable } from '@nestjs/common';
import { CreateChattingDto } from '../dto/Create-Chatting.dto';
import { CreateChattingService } from './create-chatting.service';
import { DeleteChattingService } from './delete-chatting.service';
import { GetChattingPhotoService } from './get-chatting-photo.service';
import { GetChattingService } from './get-chatting.service';

@Injectable()
export class ChattingProxyService {
  constructor(
    private readonly getChattingService: GetChattingService,
    private readonly deleteChattingService: DeleteChattingService,
    private readonly getChattingPhotoService: GetChattingPhotoService,
    private readonly createChattingService: CreateChattingService,
  ) {}
  async findMany(
    coupleId: string,
    userId: string,
    base: number,
    limit: number,
  ) {
    return this.getChattingService.findManyForChattingDto(
      coupleId,
      userId,
      base,
      limit,
    );
  }

  async findManyForPhoto(chattingId: string) {
    return this.getChattingPhotoService.findOneForPhotoDto(chattingId);
  }

  async create(dto: CreateChattingDto) {
    return this.createChattingService.create(dto);
  }

  async removeOneForOurs(chattingId: string) {
    return this.deleteChattingService.removeOneForOurs(chattingId);
  }

  async removeOneForMine(chattingId: string, userId: string) {
    return this.deleteChattingService.removeOneForMine(chattingId, userId);
  }
}
