import { ArchivedChattingDto } from '../dto/ArchivedChatting.dto';
import { ArchivedChattingInterface } from '../types/ArchivedChatting.type';

export class ChattingArchivedMapper {
  mapFromRelationForMany(chattingStorage: ArchivedChattingInterface[]) {
    return chattingStorage.map((cs) => this.mapFromRelationForOne(cs));
  }

  mapFromRelationForOne(cs: ArchivedChattingInterface) {
    const dto: ArchivedChattingDto = {
      chattingId: cs.id,
      content: cs.Chattings.content,
      writerName: cs.Chattings.Users.nickName,
      writedAt: cs.Chattings.createdAt,
      archivedAt: cs.createdAt,
    };
    return dto;
  }
}
