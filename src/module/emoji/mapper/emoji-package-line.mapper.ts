import { EmojiPackageLineDto } from '../../chatting/dto/EmojiPackageLine.dto';
import { EmojiOrderPackage } from '../../chatting/types/ChattingInterfaces';

export class EmojiPackageLineMapper {
  mapFromRelationForMany(packs: EmojiOrderPackage[]) {
    return packs.map((pack) => this.mapFromRelationForOne(pack));
  }

  mapFromRelationForOne(pack: EmojiOrderPackage) {
    const dto: EmojiPackageLineDto = {
      id: pack.id,
      name: pack.Emoji_Package.name,
    };
    return dto;
  }
}
