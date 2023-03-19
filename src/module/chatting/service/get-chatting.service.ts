import { Injectable } from '@nestjs/common';
import { ChattingDto } from '../dto/Chatting.dto';
import {
  ChattingAndReplyInterfaceForMapping,
  ChattingImgUrlsInterface,
  ChattingImgVoiceEmojiUrlsInterface,
  ChattingImgVoiceUrlsInterface,
  ChattingInterface,
  ChattingVideoUrlInterface,
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
      .then((chatting) => this.getVideoUrl(chatting))
      .then((chattings) => this.getVoiceMsgUrl(chattings))
      .then((chattings) => this.getEmogiUrl(chattings))
      .then((chattings) => this.getProfileUrl(chattings))
      .then((chattings) =>
        Promise.all(
          chattings.map(async (chatting) => {
            const others = await this.getImageUrl(chatting.other_Chattings)
              .then((oc) => this.getVideoUrl(oc))
              .then((oc) => this.getVoiceMsgUrl(oc))
              .then((oc) => this.getEmogiUrl(oc))
              .then((oc) => this.getProfileUrl(oc));
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
      .then((chatting) => this.getVideoUrl(chatting))
      .then((chatting) => this.getVoiceMsgUrl(chatting))
      .then((chatting) => this.getEmogiUrl(chatting))
      .then((chatting) => this.getProfileUrl(chatting))
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
        let s3Paths = [];
        for (const cp of chatting.Chatting_Photo) {
          if (!cp.Photos.VideoStorage) s3Paths.push(cp.Photos.s3Path);
        }
        let imageUrls = [];
        if (s3Paths.length !== 0)
          imageUrls = await this.chattingS3Service.getSignedUrls(s3Paths);

        return { imageUrls, ...chatting };
      }),
    );
  }

  async getVideoUrl(chattings: ChattingImgUrlsInterface[]) {
    return await Promise.all(
      chattings.map(async (chatting) => {
        const videoUrls = await Promise.all(
          chatting.Chatting_Photo.map(async (cp) => {
            if (cp.Photos.VideoStorage) {
              const { s3Path, time } = cp.Photos.VideoStorage;
              const thumbnailUrl = await this.chattingS3Service.getSingedUrl(
                cp.Photos.s3Path,
              );
              const videoUrl = await this.chattingS3Service.getSingedUrl(
                s3Path,
              );
              return { thumbnailUrl, videoUrl, time };
            }
          }),
        );
        return { videoUrls, ...chatting };
      }),
    );
  }

  async getVoiceMsgUrl(chattings: ChattingVideoUrlInterface[]) {
    return await Promise.all(
      chattings.map(async (chatting) => {
        const voiceMsgUrls = await Promise.all(
          chatting.VoiceStorage.map(async (voice) => {
            const url = await this.chattingS3Service.getSingedUrl(voice.s3Path);
            return { url, time: voice.time };
          }),
        );

        return { voiceMsgUrls, ...chatting };
      }),
    );
  }

  async getEmogiUrl(chattings: ChattingImgVoiceUrlsInterface[]) {
    return await Promise.all(
      chattings.map(async (chatting) => {
        const emojiUrls = chatting.Chatting_Emoji.map(
          (ce) => ce.Emojis.imageUrl,
        );
        return { emojiUrls, ...chatting };
      }),
    );
  }

  async getProfileUrl(chattings: ChattingImgVoiceEmojiUrlsInterface[]) {
    for (const chatting of chattings) {
      chatting.Users.profileId = await this.chattingS3Service.getSingedUrl(
        chatting.Users.Photos_PhotosToUsers_profileId.s3Path,
      );
    }
    return chattings;
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
      videoUrls: chatting.videoUrls,
      voiceMsgUrls: chatting.voiceMsgUrls,
      imageUrls: chatting.imageUrls,
      createdAt: chatting.createdAt,
      isMine,
      Writer: {
        id: chatting.userId,
        name: chatting.Users.nickName,
        imageUrl: chatting.Users.profileId,
      },
    };
    return chattingDto;
  }
}
