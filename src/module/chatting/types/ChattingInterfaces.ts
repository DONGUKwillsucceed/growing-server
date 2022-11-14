import {
  Chattings,
  Chatting_Emoji,
  Chatting_Photo,
  Couples,
  Emojis,
  Photos,
  Users,
  VoiceStorage,
} from '@prisma/client';

export type ChattingIncludeQueryType = Chattings & {
  Users: Users;
  Couples: Couples;
  Chatting_Photo: (Chatting_Photo & {
    Photos: Photos;
  })[];
  VoiceStorage: VoiceStorage[];
  Chatting_Emoji: (Chatting_Emoji & {
    Emojis: Emojis;
  })[];
};

export type ChattingInterface = ChattingIncludeQueryType & {
  other_Chattings?: ChattingIncludeQueryType[];
};

export interface ChattingImgUrlsInterface extends ChattingInterface {
  imageUrls: string[];
}

export interface ChattingImgVoiceUrlsInterface
  extends ChattingImgUrlsInterface {
  voiceMsgUrls: string[];
}

export interface ChattingImgVoiceEmojiUrlsInterface
  extends ChattingImgVoiceUrlsInterface {
  emojiUrls: string[];
}

export interface ChattingAndReplyInterfaceForMapping
  extends ChattingImgVoiceEmojiUrlsInterface {
  others: ChattingImgVoiceEmojiUrlsInterface[];
}