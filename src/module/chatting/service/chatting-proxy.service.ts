import { Injectable } from '@nestjs/common';
import { CreateChattingDto } from '../dto/Create-Chatting.dto';
import { EmojiLineDto } from '../dto/EmojiLine.dto';
import { EmojiPackageLineDto } from '../dto/EmojiPackageLine.dto';
import { EmojiLineMapper } from '../mapper/emoji-line.mapper';
import { EmojiPackageLineMapper } from '../mapper/emoji-package-line.mapper';
import { ChattingEmojiService } from './chatting-emoji.service';
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
    private readonly chattingEmojiService: ChattingEmojiService,
    private readonly emojiLineMapper: EmojiLineMapper,
    private readonly emojiPackageLineMapper: EmojiPackageLineMapper,
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

  async findManyForEmojiPackage(userId: string) {
    return this.chattingEmojiService
      .findManyForEmojiPackage(userId)
      .then((packs) =>
        this.emojiPackageLineMapper.mapFromRelationForMany(packs),
      );
  }

  async findManyForEmoji(packageId: string) {
    return this.chattingEmojiService
      .findManyForEmoji(packageId)
      .then((pack) => this.emojiLineMapper.mapFromRelationForMany(pack.Emojis));
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

  async removeOneForOurs(chattingId: string) {
    return this.deleteChattingService.removeOneForOurs(chattingId);
  }

  async removeOneForMine(chattingId: string, userId: string) {
    return this.deleteChattingService.removeOneForMine(chattingId, userId);
  }
}
