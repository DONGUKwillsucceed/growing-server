import {
  Chattings,
  Chatting_Emoji,
  Chatting_Photo,
  Couples,
  Emojis,
  Emoji_Order,
  Emoji_Package,
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

export interface EmojiOrderPackage extends Emoji_Order {
  Emoji_Package: Emoji_Package;
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

export interface CreateChattingInterface {
  chattingId: string;
  content: string | null;
  emojiId: string | null;
  imageIds: string[]; // 사진, 비디오
  voiceMsgIds: string[];
  userId: string;
  coupleId: string;
}
