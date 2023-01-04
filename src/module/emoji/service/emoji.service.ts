import { Injectable } from '@nestjs/common';
import { EmojiLineMapper } from '../mapper/emoji-line.mapper';
import { EmojiPackageLineMapper } from '../mapper/emoji-package-line.mapper';
import { GetEmojiService } from './get-emoji.service';

@Injectable()
export class EmojiService {
  constructor(
    private readonly getEmojiService: GetEmojiService,
    private readonly emojiPackageLineMapper: EmojiPackageLineMapper,
    private readonly emojiLineMapper: EmojiLineMapper,
  ) {}

  async findManyForEmojiPackage(userId: string) {
    return this.getEmojiService
      .findManyForEmojiPackage(userId)
      .then((packs) =>
        this.emojiPackageLineMapper.mapFromRelationForMany(packs),
      );
  }

  async findManyForEmoji(packageId: string) {
    return this.getEmojiService
      .findManyForEmoji(packageId)
      .then((pack) => this.emojiLineMapper.mapFromRelationForMany(pack.Emojis));
  }
}
