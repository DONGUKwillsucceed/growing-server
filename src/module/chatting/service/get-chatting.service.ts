import { Injectable } from '@nestjs/common';
import { ChattingDto } from '../dto/Chatting.dto';
import {
  ChattingAndReplyInterfaceForMapping,
  ChattingImgUrlsInterface,
  ChattingImgVoiceEmojiUrlsInterface,
  ChattingImgVoiceUrlsInterface,
  ChattingInterface,
} from '../types/ChattingInterfaces';
import { ChattingDBService } from './chatting-db.service';
import { ChattingS3Service } from './chatting-s3.service';

@Injectable()
export class GetChattingService {
  constructor(
    private readonly chattingDBService: ChattingDBService,
    private readonly chattingS3Service: ChattingS3Service,
  ) {}

  async findManyForChattingDto(
    coupleId: string,
    userId: string,
    base: number,
    limit: number,
  ) {
    return await this.chattingDBService
      .findMany(coupleId, userId, base, limit)
      .then((chattings) => this.getImageUrl(chattings))
      .then((chattings) => this.getVoiceMsgUrl(chattings))
      .then((chattings) => this.getEmogiUrl(chattings))
      .then((chattings) =>
        Promise.all(
          chattings.map(async (chatting) => {
            const others = await this.getImageUrl(chatting.other_Chattings)
              .then((oc) => this.getVoiceMsgUrl(oc))
              .then((oc) => this.getEmogiUrl(oc));
            return { others, ...chatting };
          }),
        ),
      )
      .then((chattings) => this.mapFromRelation(chattings, userId));
  }

  async findOneForChattingDto(chattingId: string, userId: string) {
    return this.chattingDBService
      .findOne(chattingId)
      .then((chatting) => this.getImageUrl([chatting]))
      .then((chatting) => this.getVoiceMsgUrl(chatting))
      .then((chatting) => this.getEmogiUrl(chatting))
      .then((chatting) => {
        let isMine = false;
        if (chatting[0].userId === userId) {
          isMine = true;
        }
        return this.setChattingDto(chatting[0], isMine);
      });
  }

  async getImageUrl(chattings: ChattingInterface[]) {
    return await Promise.all(
      chattings.map(async (chatting) => {
        const s3Paths = chatting.Chatting_Photo.map((cp) => cp.Photos.s3Path);
        const imageUrls = await this.chattingS3Service.getSignedUrls(s3Paths);
        return { imageUrls, ...chatting };
      }),
    );
  }

  async getVoiceMsgUrl(chattings: ChattingImgUrlsInterface[]) {
    return await Promise.all(
      chattings.map(async (chatting) => {
        const s3Paths = chatting.VoiceStorage.map((voice) => voice.s3Path);
        const voiceMsgUrls = await this.chattingS3Service.getSignedUrls(
          s3Paths,
        );
        return { voiceMsgUrls, ...chatting };
      }),
    );
  }

  async getEmogiUrl(chattings: ChattingImgVoiceUrlsInterface[]) {
    return await Promise.all(
      chattings.map(async (chatting) => {
        const s3Paths = chatting.Chatting_Emoji.map((ce) => ce.Emojis.s3Path);
        const emojiUrls = await this.chattingS3Service.getSignedUrls(s3Paths);
        return { emojiUrls, ...chatting };
      }),
    );
  }

  mapFromRelation(
    chattings: ChattingAndReplyInterfaceForMapping[],
    userId: string,
  ) {
    return chattings.map((chatting) => {
      let isParentMine = false;
      if (chatting.userId === userId) {
        isParentMine = true;
      }

      const parentChatting = this.setChattingDto(chatting, isParentMine);
      let childChatting: ChattingDto | null = null;

      if (chatting.other_Chattings.length > 0) {
        let isChildMine = false;
        if (chatting.other_Chattings[0].userId === userId) {
          isChildMine = true;
        }
        const oc = chatting.others[0];
        childChatting = this.setChattingDto(oc, isChildMine);
      }

      return { childChatting, parentChatting };
    });
  }

  setChattingDto(
    chatting: ChattingImgVoiceEmojiUrlsInterface,
    isMine: boolean,
  ) {
    const chattingDto: ChattingDto = {
      id: chatting.id,
      content: chatting.content,
      emojiUrl: chatting.emojiUrls[0] ? chatting.emojiUrls[0] : null,
      voiceMsgUrls: chatting.voiceMsgUrls,
      imageUrls: chatting.imageUrls,
      createdAt: chatting.createdAt,
      isMine,
      Writer: {
        id: chatting.userId,
        name: chatting.Users.nickName,
        imageUrl: chatting.Users.profileImageS3Path,
      },
    };
    return chattingDto;
  }
}
