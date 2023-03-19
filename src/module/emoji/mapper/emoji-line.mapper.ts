import { Emojis } from '@prisma/client';
import { EmojiLineDto } from '../dto/EmojiLine.dto';

export class EmojiLineMapper {
  mapFromRelationForMany(emojis: Emojis[]) {
    return emojis.map((emoji) => this.mapFromRelationForOne(emoji));
  }

  mapFromRelationForOne(emoji: Emojis) {
    const dto: EmojiLineDto = {
      id: emoji.id,
      imageUrl: emoji.imageUrl,
      name: emoji.name,
    };
    return dto;
  }
}
