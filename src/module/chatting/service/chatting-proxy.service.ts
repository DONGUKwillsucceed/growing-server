import { Injectable } from '@nestjs/common';
import { CreateChattingDto } from '../dto/Create-Chatting.dto';
import { CreateChattingService } from './create-chatting.service';
import { DeleteChattingService } from './delete-chatting.service';
import { GetChattingPhotoService } from './get-chatting-photo.service';
import { GetChattingService } from './get-chatting.service';
import { ConfirmChattingDto } from '../dto/ConfirmChatting.dto';
import { UpdateChattingService } from './update-chatting.service';

@Injectable()
export class ChattingProxyService {
  constructor(
    private readonly getChattingService: GetChattingService,
    private readonly deleteChattingService: DeleteChattingService,
    private readonly getChattingPhotoService: GetChattingPhotoService,
    private readonly createChattingService: CreateChattingService,
    private readonly updateChattingService: UpdateChattingService,
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

  async findOne(chattingId: string, userId: string) {
    return this.getChattingService.findOneForChattingDto(chattingId, userId);
  }

  async findManyForPhoto(chattingId: string) {
    return this.getChattingPhotoService.findOneForPhotoDto(chattingId);
  }

  async create(dto: CreateChattingDto) {
    return this.createChattingService.create(dto);
  }

  async confirm(dto: ConfirmChattingDto) {
    return this.updateChattingService.confirm(dto);
  }

  async removeOneForOurs(chattingId: string) {
    return this.deleteChattingService.removeOneForOurs(chattingId);
  }

  async removeOneForMine(chattingId: string, userId: string) {
    return this.deleteChattingService.removeOneForMine(chattingId, userId);
  }
}
