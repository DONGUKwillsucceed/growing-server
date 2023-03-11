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
  VideoStorage,
  VoiceStorage,
} from '@prisma/client';

export type ChattingIncludeQueryType = Chattings & {
  Users: Users & { Photos_PhotosToUsers_profileId: Photos };
  Couples: Couples;
  Chatting_Photo: (Chatting_Photo & {
    Photos: Photos & { VideoStorage: VideoStorage };
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

export interface ChattingVideoUrlInterface extends ChattingImgUrlsInterface {
  videoUrls: { thumbnailUrl: string; videoUrl: string; time: number }[];
}

export interface EmojiOrderPackage extends Emoji_Order {
  Emoji_Package: Emoji_Package;
}

export interface ChattingImgVoiceUrlsInterface
  extends ChattingVideoUrlInterface {
  voiceMsgUrls: { url: string; time: number }[];
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
