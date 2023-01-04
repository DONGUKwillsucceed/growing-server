import { Emojis } from '@prisma/client';
import { EmojiLineDto } from '../../chatting/dto/EmojiLine.dto';

export class EmojiLineMapper {
  mapFromRelationForMany(emojis: Emojis[]) {
    return emojis.map((emoji) => this.mapFromRelationForOne(emoji));
  }

  mapFromRelationForOne(emoji: Emojis) {
    const dto: EmojiLineDto = {
      id: emoji.packageId,
      imageUrl: emoji.imageUrl,
      name: emoji.name,
    };
    return dto;
  }
}
