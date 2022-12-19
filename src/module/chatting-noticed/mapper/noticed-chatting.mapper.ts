import { NoticedChattingDto } from '../dto/NoticedChatting.dto';
import { NoticedChattingInterface } from '../types/NoticeInterfaces';

export class NoticedChattingMapper {
  mapFromRelation(notice: NoticedChattingInterface) {
    const noticedChatting = notice.NoticedChatting;
    const dto: NoticedChattingDto = {
      id: noticedChatting.id,
      content: noticedChatting.Chattings.content,
      announcer: noticedChatting.Users.nickName,
      isFolden: !!notice.isFolden,
    };
    return dto;
  }
}
